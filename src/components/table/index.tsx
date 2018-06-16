declare const mui, plus;

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
    public userInfo;
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
                state: 1002
            }, {
                name: "去完成",
                state: 1001
            }, {
                name: "未完成",
                state: 1003
            }]
        };
    }
    componentWillMount() {
        mui.plusReady(() => {
            let { collectAreaId } = this.props;
            this.setState({ dict: Utils.getSettings("dict") });
            if (collectAreaId) {
                this.userInfo = Utils.getSettings("userInfo");
                this.getTableData({
                    page: 1,
                    operatorId: this.userInfo.userId,
                    collectAreaId: collectAreaId
                });
            }
            window.addEventListener("reloadData", (ev: Event) => {
                this.setState({ list: [], loading: true });
                this.getTableData({
                    page: 1,
                    operatorId: this.userInfo.userId,
                    collectAreaId: collectAreaId
                });
            })
        })
    }
    pullToRefresh(ref) {
        let self = this;
        mui(ref).pullToRefresh({
            down: {
                height: 150,
                callback: function () {
                    self.pulldownRefresh();
                    setTimeout(() => {
                        this.endPullDownToRefresh()
                    }, 1000);
                }
            }
        })
    }
    pulldownRefresh() {
        this.setState({ list: [], loading: true });
        this.getTableData({
            page: 1,
            operatorId: this.userInfo.userId,
            collectAreaId: this.props.collectAreaId
        });
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
            this.setState({ active: i, loading: true, list: [] });
            let { state } = this.state.filters[i];
            this.getTableData({
                page: 1,
                collectAreaId: this.props.collectAreaId,
                operatorId: this.userInfo.userId,
                state
            });
        }
    }
    async dataUpLoad(params) {
        try {
            await Service.serviceDataUpload(params);
            mui.fire(plus.webview.currentWebview(), "reloadData");
            plus.nativeUI.closeWaiting();
            mui.toast("上传成功");
        } catch (error) {
            plus.nativeUI.closeWaiting();
            mui.toast("上传失败");
        }
        await Service.updateStateOrUseState({
            state: 1002,
            tableId: params.tableId
        });
    }
    handleUpload(data) {
        if (data.state == 1003) {
            plus.nativeUI.confirm('确认上传？', ({ index }) => {
                if (index == 0) {
                    plus.nativeUI.showWaiting("上传中...");
                    this.dataUpLoad({
                        tableId: data.id
                    });
                }
            });
        }
    }
    render(props: AppProps, state: AppState) {
        let { list, loading } = state;
        return (
            <div class="app-table" id="pullrefresh">
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
                        <div class="mui-scroll" ref={this.pullToRefresh.bind(this)}>
                            <div className="table-wrap">
                                {list.length > 0 ? list.map((item, index) => (
                                    <div className="app-table-item app-table-row">
                                        <div className="order">{index + 1}</div>
                                        <div className="tableName">{item.anotherName}</div>
                                        <div className="status">{this.getState(item.state)}</div>
                                        <div className="option">
                                            {item.state == 1001 && (
                                                <span alt="" {...{ onTap: () => Utils.openPage("addData", { table: { ...item, viewId: plus.webview.currentWebview().id } }) }} >添加</span>
                                            )}
                                            {(item.state == 1002 || item.state == 1003) && (
                                                <div>
                                                    <span alt="" {...{ onTap: () => Utils.openPage("tableList", { table: { ...item, viewId: plus.webview.currentWebview().id } }) }} >预览</span>
                                                    <span className={item.state == 1002 ? "gray" : ""} {...{ onTap: this.handleUpload.bind(this, item) }}>上传</span>
                                                </div>
                                            )}
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