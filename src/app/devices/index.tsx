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
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    public view
    constructor(props: AppProps) {
        super(props);
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            let { collectAreaId } = this.view.params;
            this.setState({ collectAreaId });
            plus.navigator.setStatusBarStyle("light");
            Utils.hideScroll();
            this.getChartData()
        });
    }
    getChartData() {
        Service.equipManage({
            devAddr: 3
        })
    }
    componentDidMount() {
        Utils.setImmersed();
        Utils.handleBack();
    }
    render(props: AppProps, state: AppState) {
        let { collectAreaId } = state;
        return (
            <div className="app-container devices">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">农机设备管理</h1>
                </header>
                <div class="mui-content">
                    <TabScroll>
                        <Table collectAreaId={collectAreaId}></Table>
                        <div className="charts">

                        </div>
                    </TabScroll>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);