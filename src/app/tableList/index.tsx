declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import Utils from "../../utils";
import Service from "../../server";

interface AppProps { }
interface AppState {
    title: string;
    info: any;
    page: number;
    list: object[]
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    listener: Function;
    public view;
    constructor(props: AppProps) {
        super(props);
        this.state = { list: [], page: 0, title: "", info: {} };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            this.setState({ title: this.view.table.anotherName, info: this.view.table });
        });
    }
    componentDidMount() {
        Utils.setImmersed();
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                down: {
                    style: 'circle',
                    height: Utils.Px(150),
                    range: Utils.Px(250),
                    offset: Utils.Px(130),
                    callback: this.pulldownRefresh.bind(this)
                },
                up: {
                    auto: true,
                    callback: this.pullupRefresh.bind(this)
                }
            }
        });
        this.listener("refresh", (ev: Event) => {
            this.pulldownRefresh();
        });
    }
    getTableList(params) {
        let { page, reload } = params;
        Service.serviceDataList({
            page,
            parentId: this.state.info.parentTableId,
            virtualTableIds: [this.state.info.id]
        }).then((data: any) => {
            let list = data.result.pageData;
            this.setState({ list: reload ? list : this.state.list.concat(list), page });
            mui('#pullrefresh').pullRefresh().endPullupToRefresh((list.length < 10));
        });
    }
    pulldownRefresh() {
        setTimeout(() => {
            let pullrefresh = mui('#pullrefresh')
            pullrefresh.pullRefresh().endPulldownToRefresh();
            pullrefresh.pullRefresh().refresh(true);
            this.getTableList({
                page: 1,
                reload: true
            });
        }, 1000);
    }
    pullupRefresh() {
        setTimeout(() => {
            this.getTableList({
                page: this.state.page + 1
            });
        }, 1000);
    }
    handleEdit(info) {
        let { id } = info;
        Utils.openPage("addData", { table: this.view.table, recordId: id })
    }
    render(props: AppProps, state: AppState) {
        return (
            <div className="app-container tableList">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">表数据预览</h1>
                    <span class="mui-btn mui-btn-link mui-pull-right" {...{ onTap: () => Utils.openPage("addData", { table: this.view.table }) }}>新增记录</span>
                </header>
                <div id="pullrefresh" class="mui-content mui-scroll-wrapper">
                    <div class="mui-scroll">
                        {state.list.map((item: any, index: number) => {
                            let values: object = JSON.parse(item.value);
                            return (
                                <div className="item">
                                    <div className="table-row table-row-title">
                                        <div className="table-col"> <label>第{index + 1}条记录</label> </div>
                                        <div className="table-col">
                                            {item.state == 0 && <span class="iconfont icon-edit mui-pull-right" {...{ onTap: () => this.handleEdit(item) }}></span>}
                                        </div>
                                    </div>
                                    <div className="table-row table-row-item">
                                        {Object.keys(values).map(field => (
                                            <div className="table-col">
                                                <label>{field}：</label>
                                                <span className="text">{values[field]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);