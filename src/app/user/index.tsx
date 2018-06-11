declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import Utils from "../../utils";

interface AppProps { }
interface AppState {
    max: number;
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    constructor(props: AppProps) {
        super(props);
        this.state = { max: 25 };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            plus.navigator.setStatusBarStyle("light");
            Utils.hideScroll();
        });
    }
    componentDidMount() {
        Utils.setImmersed();
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
                }
            }
        });
    }
    pulldownRefresh() {
        setTimeout(() => {
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        }, 1000);
    }
    getPresent(num) {
        return (num / this.state.max) * 100 + "%";
    }
    render(props: AppProps, state: AppState) {
        let list = [];
        for (var i = 0; i <= this.state.max; i++) {
            if (i % Math.ceil(this.state.max / 5) == 0) {
                list.push(<span>{i}</span>);
            }
        }
        return (
            <div className="app-container user">
                <header id="header" class="mui-bar mui-bar-nav mui-bar-transparent">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">个人中心</h1>
                </header>
                <div className="mui-content" id="pullrefresh">
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
                    <div className="dataChart">
                        <h3>历史上传数</h3>
                        <div className="charts">
                            <div className="item">
                                <div className="title">农机设备管理</div>
                                <div className="count">
                                    <div className="len" style={{ width: this.getPresent(10) }}></div>
                                    <span>10</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">栽培历</div>
                                <div className="count">
                                    <div className="len" style={{ width: this.getPresent(22) }}></div>
                                    <span>22</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">挖土深根</div>
                                <div className="count">
                                    <div className="len" style={{ width: this.getPresent(17) }}></div>
                                    <span>17</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">土肥与营养</div>
                                <div className="count">
                                    <div className="len" style={{ width: this.getPresent(14) }}></div>
                                    <span>14</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">农机活动</div>
                                <div className="count">
                                    <div className="len" style={{ width: this.getPresent(11) }}></div>
                                    <span>11</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">枝蔓管理</div>
                                <div className="count">
                                    <div className="len" style={{ width: this.getPresent(13) }}></div>
                                    <span>13</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">植保管理</div>
                                <div className="count">
                                    <div className="len" style={{ width: this.getPresent(14) }}></div>
                                    <span>14</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">虫病情</div>
                                <div className="count">
                                    <div className="len" style={{ width: this.getPresent(18) }}></div>
                                    <span>18</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">（张）</div>
                                <div className="count-x">
                                    {list}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);