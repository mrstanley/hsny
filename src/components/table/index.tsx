declare const mui;

import "./index.scss";
import { h, Component } from "preact";
import Service from "../../server/index";
import Utils from "../../utils";

interface AppProps {
    children?: object;
    collectAreaId: string;
}
interface AppState {
    filters: any[];
    page: number;
    list: any[];
    dict: any[];
    loading: boolean;
    active: number;
}

export default class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            page: 0,
            list: [],
            dict: [],
            loading: true,
            active: 0,
            filters: [{
                name: "全部分类",
            }, {
                name: "已完成",
                value: 1002
            }, {
                name: "未完成",
                value: 1001
            }]
        };
    }
    componentWillMount() {
        mui.plusReady(() => {
            let { collectAreaId } = this.props;
            this.setState({ dict: Utils.getSettings("dict") });
            if (collectAreaId) {
                let userInfo = Utils.getSettings("userInfo");
                this.getTableData({
                    page: 1,
                    collectAreaId: collectAreaId,
                    operatorId: userInfo.userId
                });
            }
        })
    }
    getTableData(params: any) {
        Service.getVirtualTableList(params).then((data: any) => {
            let { totalCount, pageData } = data;
            this.setState({ list: this.state.list.concat(pageData), page: params.page, loading: false });
        }).catch(() => {
            this.setState({ loading: false });
        });
    }
    getState(state) {
        let item = this.state.dict.find(i => i.id == state);
        return item && item.value || "未知";
    }
    handleChangeState(i) {
        if (this.state.active !== i) {
            this.setState({ active: i });
            let { value: state } = this.state.filters[i];
            let userInfo = Utils.getSettings("userInfo");
            this.getTableData({
                page: 1,
                collectAreaId: this.props.collectAreaId,
                operatorId: userInfo.userId,
                state
            });
        }
    }
    render(props: AppProps, state: AppState) {
        let { list, loading } = state;
        return (
            <div class="app-table">
                <div className="app-table-filter  app-table-border">
                    {state.filters.map((item: any, i: number) => (
                        <span className={i == state.active ? "mui-active" : ""} {...{ onTap: this.handleChangeState.bind(this, i) }}>{item.name}</span>
                    ))}
                </div>
                <div className="app-table-header app-table-border app-table-row">
                    <div className="order">序号</div>
                    <div className="tableName">表名</div>
                    <div className="status">状态</div>
                    <div className="option">操作</div>
                </div>
                <div className="app-table-wrap">
                    <div id="scroll" class="mui-scroll-wrapper">
                        <div class="mui-scroll">
                            <div className="table-wrap">
                                {list.length > 0 ? list.map((item, index) => (
                                    <div className="app-table-item app-table-row">
                                        <div className="order">{index + 1}</div>
                                        <div className="tableName">{item.collectAreaName}</div>
                                        <div className="status">{this.getState(item.state)}</div>
                                        <div className="option">
                                            {item.state == 1001 && <span>添加</span>}
                                            {item.state == 1002 && (<div><span>编辑</span><span>上传</span></div>)}
                                        </div>
                                    </div>
                                )) : (
                                        <div className="app-table-noData">{loading ? "加载中..." : "暂无表数据"}</div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}