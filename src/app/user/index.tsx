declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
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
            <div className="app-container user">
                <header id="header" class="mui-bar mui-bar-nav mui-bar-transparent">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">个人中心</h1>
                </header>
                <div className="mui-content">
                    <div className="overview">
                        <div className="total">
                            <h1>0</h1>
                            <span>今日上传</span>
                        </div>
                        <div className="total">
                            <h1>10</h1>
                            <span>昨日上传</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);