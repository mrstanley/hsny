declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import { setImmersed } from "../../utils";

interface AppProps { }
interface AppState { }

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    listener: Function;
    constructor(props: AppProps) {
        super(props);
        this.mixins.forEach(m => Object.assign(this, m));
        this.init();
    }
    componentDidMount() {
        setImmersed()
    }
    render(props: AppProps, state: AppState) {
        return (
            <div className="app-container">
                <header id="header" class="mui-bar mui-bar-transparent">
                    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
                    <h1 class="mui-title">导航栏</h1>
                </header>
            </div>
        );
    }
}

render(<App />, document.body);