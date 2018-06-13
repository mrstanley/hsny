declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import Utils from "../../utils";
import Service from "../../server";

interface AppProps { }
interface AppState {
    count: number;
    page: number;
    list: object[]
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    public userInfo
    constructor(props: AppProps) {
        super(props);
        this.state = { count: 0, list: [], page: 0 };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            plus.navigator.setStatusBarStyle("light");
            this.userInfo = Utils.getSettings("userInfo");
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
    getMessages({ page }) {
        let userId = this.userInfo.userId;
        Service.getMessage({
            query: `{msgs(acceptUserId:${userId},page:${page},size:10){totalCount,pageData{queryAll}}}`
        }).then((data: any) => {
            if (data.msgs.length) {
                let list = data.msgs[0].pageData;
                this.setState({ list: this.state.list.concat(list), page });
                mui('#pullrefresh').pullRefresh().endPullupToRefresh((list.length < 10));
            } else {
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
            }
        });
    }
    pulldownRefresh() {
        setTimeout(() => {
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        }, 1000);
    }
    pullupRefresh() {
        setTimeout(() => {
            this.getMessages({
                page: this.state.page + 1
            });
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
                        {state.list.map((item: any) => (
                            <div className="item" {...{ onTap: () => Utils.openPage("messageDetail", { msgId: item.id }) }}>
                                <div className="title">
                                    <h3>{item.title}</h3>
                                    <span className="time">{item.createTime.split(".")[0]}</span>
                                </div>
                                <p className="desc">{item.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);