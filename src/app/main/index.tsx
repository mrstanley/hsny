declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import Service from "../../server/index";
import Utils from "../../utils";

interface AppProps { }
interface AppState {
    icons: any[];
    menus: object[];
    hasMenus: object[];
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    listener: Function;
    constructor(props: AppProps) {
        super(props);
        this.mixins.forEach(m => Object.assign(this, m));
        this.state = {
            menus: [],
            hasMenus: [],
            icons: [{}, {
                icon: "icon-CB",
                name: "disease"
            }, {
                icon: "icon-ZB",
                name: "plantProtect"
            }, {
                icon: "icon-HG",
                name: "flowerFruits"
            }, {
                icon: "icon-ZM",
                name: "branch"
            }, {
                icon: "icon-NH",
                name: "farming"
            }, {
                icon: "icon-TF",
                name: "nutrition"
            }, {
                icon: "icon-WT",
                name: "cut"
            }, {
                icon: "icon-ZL",
                name: "grow"
            }, {
                icon: "icon-NS",
                name: "devices"
            }]
        };
        this.init(() => {
            this.login();
            Utils.hideScroll();
            mui.later(() => {
                plus.navigator.setStatusBarStyle("dark");
                plus.navigator.setFullscreen(false);
                plus.navigator.closeSplashscreen();
            }, 3000);
        });
    }
    getCollectAreaList() {
        Service.getCollectAreaList({}).then((data: any) => {
            let { pageData } = data;
            this.setState({ menus: pageData, hasMenus: Utils.getSettings("userInfo").collectAreaIds });
        });
    }
    getDict() {
        Service.dict({}).then((data: any) => {
            Utils.setSettings("dict", data);
        });
    }
    login() {
        if (!Utils.getCookie("authorization")) {
            Utils.openPage("login", { from: { barStyle: "dark", name: "main" } });
        } else {
            this.getCollectAreaList();
            this.getDict();
        }
    }
    componentDidMount() {
        Utils.setImmersed();
        this.listener("login", () => {
            this.getCollectAreaList();
            this.getDict();
        });
    }
    handleOpenPage(item: any) {
        let { name } = this.state.icons[item.id];
        if (name && this.state.hasMenus.indexOf(item.id) >= 0) {
            if (Utils.getCookie("authorization")) {
                Utils.openPage(name, { from: { barStyle: "dark" }, params: { collectAreaId: item.id } });
            } else {
                Utils.openPage("login", { from: { barStyle: "dark" } });
            }
        } else {
            mui.toast("暂无权限");
        }
    }
    handleIsLogin(page) {
        if (Utils.getCookie("authorization")) {
            Utils.openPage(page, { from: { barStyle: "dark" } });
        } else {
            Utils.openPage("login", { from: { barStyle: "dark" } });
        }
    }
    render(props: AppProps, state: AppState) {
        let { menus, icons, hasMenus } = state;
        return (
            <div className="app-container main">
                <header className="app-header">
                    <div className="title">数据与管理</div>
                    <div className="bar">
                        <i className="iconfont icon-mine" {...{ onTap: this.handleIsLogin.bind(this, "user") }}></i>
                        <i className="iconfont icon-meg" {...{ onTap: this.handleIsLogin.bind(this, "message") }}></i>
                    </div>
                </header>
                <div className="mui-content">
                    {menus.length ? (
                        <ul class="nav mui-table-view mui-grid-view mui-grid-9">
                            {menus.map((item: any) => (
                                <li className={"mui-table-view-cell mui-media mui-col-xs-6 " + ((hasMenus.indexOf(item.id) < 0 || !icons[item.id].name) ? "mui-disabled" : "")}>
                                    <a {...{ onTap: this.handleOpenPage.bind(this, item) }} href="javascript:;">
                                        <span className={"iconfont " + icons[item.id].icon}></span>
                                        <div class="mui-media-body">{item.name}</div>
                                    </a>
                                </li>
                            ))}
                            <li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="javascript:;">
                                <span class="iconfont icon-more"></span>
                                <div class="mui-media-body">敬请期待</div></a>
                            </li>
                        </ul>
                    ) : (
                            <div className="noMenu">
                                {Utils.getCookie("authorization") ? "敬请期待" : <span className="notice" {...{ onTap: this.handleIsLogin.bind(this, "") }}>请登录</span>}
                            </div>
                        )}
                </div>
            </div>
        );
    }
}

render(<App />, document.body);