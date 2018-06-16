declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import Utils from "../../utils";
import Service from "../../server";

interface AppProps { }
interface AppState {
    max: number;
    collectStatisticsVos: any;
    todayUploadNum: number;
    yesterdayUploadNum: number;
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    public view;
    constructor(props: AppProps) {
        super(props);
        this.state = { max: 25, collectStatisticsVos: [], yesterdayUploadNum: 0, todayUploadNum: 0 };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            plus.navigator.setStatusBarStyle("light");
            Utils.hideScroll();
        });
        this.getData();
    }
    getData() {
        Service.appPersonCenterStatictics({}).then((data: any) => {
            let { collectStatisticsVos, todayUploadNum, yesterdayUploadNum } = data;
            let upnum = collectStatisticsVos.map(item => item.uploadCount);
            let max = Math.max.apply(null, upnum);
            this.setState({ collectStatisticsVos, max, todayUploadNum, yesterdayUploadNum });
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
            let pullrefresh = mui('#pullrefresh')
            pullrefresh.pullRefresh().endPulldownToRefresh();
            this.getData();
        }, 1000);
    }
    getPresent(num) {
        return (num / this.state.max) * 100 + "%";
    }
    handleLogout() {
        Utils.setCookie("authorization", null);
        mui.toast("退出成功");
        Utils.openPage("login", { from: { barStyle: "black", name: "main" } });
        mui.later(() => {
            this.view.close("none");
        }, 800);
    }
    handleSetting() {
        plus.nativeUI.actionSheet({
            title: "确认退出",
            cancel: "取消",
            buttons: [{
                title: "确定",
                color: "#6BC762"
            }]
        }, (e) => {
            e.index > 0 && this.handleLogout();
        });
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
                    <span class="iconfont icon-set mui-pull-right" {...{ onTap: this.handleSetting.bind(this) }}></span>
                </header>
                <div className="mui-content" id="pullrefresh">
                    <div className="overview">
                        <div className="total">
                            <h1>{state.todayUploadNum}</h1>
                            <span>今日上传</span>
                        </div>
                        <div className="total">
                            <h1>{state.yesterdayUploadNum}</h1>
                            <span>昨日上传</span>
                        </div>
                    </div>
                    <div className="dataChart">
                        <h3>历史上传数</h3>
                        {state.collectStatisticsVos.length > 0 ? (
                            <div className="charts">
                                {state.collectStatisticsVos.map(item => (
                                    <div className="item">
                                        <div className="title">{item.collectAreaName}</div>
                                        <div className="count">
                                            <div className="len" style={{ width: this.getPresent(item.uploadCount) }}></div>
                                            <span>{item.uploadCount}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="item">
                                    <div className="title">（张）</div>
                                    <div className="count-x">
                                        {list}
                                    </div>
                                </div>
                            </div>
                        ) : (
                                <div className="noData">暂无数据</div>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);