declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import Utils from "../../utils";

interface AppProps { }
interface AppState { }

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    listener: Function;
    constructor(props: AppProps) {
        super(props);
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            plus.navigator.setStatusBarStyle("dark");
            plus.navigator.setFullscreen(false);
            plus.navigator.closeSplashscreen();
        });
    }
    componentDidMount() {
        Utils.setImmersed();
    }
    render(props: AppProps, state: AppState) {
        return (
            <div className="app-container main">
                <header className="app-header">
                    <div className="title">数据与管理</div>
                    <div className="bar">
                        <i className="iconfont icon-mine"></i>
                        <i className="iconfont icon-meg"></i>
                    </div>
                </header>
                <div className="mui-content">
                    <ul class="nav mui-table-view mui-grid-view mui-grid-9">
                        <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                            <span class="iconfont icon-CB"></span>
                            <div class="mui-media-body">虫病情</div></a>
                        </li>
                        <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                            <span class="iconfont icon-ZB"></span>
                            <div class="mui-media-body">植物保护</div></a>
                        </li>
                        <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                            <span class="iconfont icon-HG"></span>
                            <div class="mui-media-body">花果管理</div></a>
                        </li>
                        <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                            <span class="iconfont icon-ZM"></span>
                            <div class="mui-media-body">枝蔓管理</div></a>
                        </li>
                        <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                            <span class="iconfont icon-NH"></span>
                            <div class="mui-media-body">农事活动管理</div></a>
                        </li>
                        <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                            <span class="iconfont icon-TF"></span>
                            <div class="mui-media-body">土肥与营养</div></a>
                        </li>
                        <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                            <span class="iconfont icon-WT"></span>
                            <div class="mui-media-body">挖图探根</div></a>
                        </li>
                        <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                            <span class="iconfont icon-ZL"></span>
                            <div class="mui-media-body">栽培历数据</div></a>
                        </li>
                        <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                            <span class="iconfont icon-NS"></span>
                            <div class="mui-media-body">农机设备管理</div></a>
                        </li>
                        <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                            <span class="iconfont icon-more"></span>
                            <div class="mui-media-body">敬请期待</div></a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);