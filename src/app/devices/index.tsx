declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import TabScroll from "../../components/tab-scroll";
import Table from "../../components/table";
import Utils from "../../utils";
import Service from "../../server";

interface AppProps { }
interface AppState {
    collectAreaId: string;
    loading: boolean;
    equipData: any;
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    public view
    constructor(props: AppProps) {
        super(props);
        this.state = { loading: true, equipData: null, collectAreaId: "" };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            let { collectAreaId } = this.view.params;
            this.setState({ collectAreaId });
            plus.navigator.setStatusBarStyle("light");
            Utils.hideScroll();
            this.getData()
        });
    }
    async getData() {
        let userInfo = Utils.getSettings("userInfo");
        let equipPromise = Service.equipManage({ devAddr: userInfo.farmingBaseId });
        let equipData: any = await equipPromise.catch(() => {
            this.setState({ loading: false });
        });
        this.setState({ loading: false, equipData });
    }
    componentDidMount() {
        Utils.setImmersed();
        Utils.handleBack();
    }
    render(props: AppProps, state: AppState) {
        let { collectAreaId, equipData, loading } = state;
        return (
            <div className="app-container devices">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">农机设备管理</h1>
                </header>
                <div class="mui-content">
                    <TabScroll>
                        <Table collectAreaId={collectAreaId}></Table>
                        <div className="chart">
                            {!loading && equipData && (
                                <div className="chart-panel">
                                    <div className="chart-panel-header">借出设备（当月）</div>
                                    <div className="chart-panel-item">
                                        <div className="bagging-wrap">
                                            <div className="bagging-item">
                                                <label>在场设备个数</label>
                                                <span className="text">10</span>
                                            </div>
                                            <div className="bagging-item">
                                                <label>借出设备个数</label>
                                                <span className="text">10</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!loading && !equipData && (<div className="noData">暂无数据</div>)}
                            {loading && (<div className="loading">加载中...</div>)}
                        </div>
                    </TabScroll>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);