declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import Utils from "../../utils";

interface AppProps { }
interface AppState {
    count: number;
    list: object[]
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    constructor(props: AppProps) {
        super(props);
        this.state = { count: 0, list: new Array(20).fill(1) };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            plus.navigator.setStatusBarStyle("light");
        });
    }
    componentDidMount() {
        Utils.setImmersed();
        Utils.hideScroll();
        Utils.handleBack();
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
    }
    pulldownRefresh() {
        setTimeout(() => {
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        }, 1000);
    }
    pullupRefresh() {
        this.setState({ count: this.state.count + 1 });
        setTimeout(() => {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh((this.state.count > 2));
        }, 1000);
    }
    render(props: AppProps, state: AppState) {
        return (
            <div className="app-container message">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">消息中心</h1>
                </header>
                <div id="pullrefresh" class="mui-content mui-scroll-wrapper">
                    <div class="mui-scroll">
                        {state.list.map(item => (
                            <div className="item">
                                <div className="title">
                                    <h3>管理员</h3>
                                    <span className="time">2018-01-12</span>
                                </div>
                                <p className="desc">
                                    启用数据表 (土壤检测表)，表类型 (虫病情数据)。
                            </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);