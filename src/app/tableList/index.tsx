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
        this.init();
    }
    componentDidMount() {
        Utils.setImmersed();
    }
    render(props: AppProps, state: AppState) {
        return (
            <div className="app-container">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">表数据预览</h1>
                    <span class="mui-btn mui-btn-link mui-pull-right">新增记录</span>
                </header>
            </div>
        );
    }
}

render(<App />, document.body);