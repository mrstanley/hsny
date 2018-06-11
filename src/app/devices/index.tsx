declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import TabScroll from "../../components/tab-scroll";
import Utils from "../../utils";

interface AppProps { }
interface AppState { }

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    constructor(props: AppProps) {
        super(props);
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            plus.navigator.setStatusBarStyle("light");
            Utils.hideScroll();
        });
    }
    componentDidMount() {
        Utils.setImmersed();
        Utils.handleBack();
    }
    render(props: AppProps, state: AppState) {
        return (
            <div className="app-container devices">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">农机设备管理</h1>
                </header>
                <div class="mui-content">
                    <TabScroll></TabScroll>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);