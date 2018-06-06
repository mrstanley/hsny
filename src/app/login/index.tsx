declare const plus, mui, require;

import { h, render, Component } from "preact";
import linkState from 'linkstate';
import { Base64 } from 'js-base64';
import Mixins from "../../components/base";
import Utils from "../../utils";
import Server from "../../server";

interface AppProps { }
interface AppState {
    password: string;
    userAccount: string;
    isLogin: boolean;
    showPws: boolean;
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    view
    constructor(props: AppProps) {
        super(props);
        this.state = {
            password: "",
            userAccount: "",
            isLogin: false,
            showPws: false
        };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init();
    }
    handleLogin(ev: Event) {
        if (!this.state.userAccount || !this.state.password)
            return mui.toast("请输入账号或密码");
        plus.nativeUI.showWaiting("登录中...");
        this.setState({ isLogin: true });
        Server.login({
            password: Base64.encode(this.state.password),
            userAccount: this.state.userAccount
        }).then((data: any) => {
            Utils.setCookie("authorization", data.authorization);
            Utils.setSettings("userInfo", data);
            mui.fire(this.view.opener(), "login");
            this.setState({ isLogin: true });
            mui.later(() => {
                mui.back();
                plus.nativeUI.closeWaiting();
            }, 800);
        }).catch(() => {
            this.setState({ isLogin: true });
            plus.nativeUI.closeWaiting();
        })
        return false;
    }
    handleEnter(ev: any) {
        if (ev.keyCode == 13) {
            this.handleLogin(ev);
            ev.target.blur();
        }
        return false;
    }
    componentDidMount() {
        Utils.setImmersed();
        Utils.handleBack();
    }
    render(props: AppProps, state: AppState) {
        let { userAccount, password, showPws } = state;
        return (
            <div className="app-container login">
                <div className="login-form">
                    <div className="logo">
                        <img src={require("../../assets/images/192x192.png")} alt="华盛农业" />
                    </div>
                    <form>
                        <div className="item">
                            <i className="iconfont icon-Accountnumber"></i>
                            <input value={userAccount} onInput={linkState(this, 'userAccount')} type="email" placeholder="请输入账号" />
                        </div>
                        <div className="item">
                            <i className="iconfont icon-Password"></i>
                            <input value={password} onKeyUp={this.handleEnter.bind(this)} onInput={linkState(this, 'password')} type={showPws ? "email" : "password"} placeholder="请输入密码" />
                            <i className={showPws ? "eye iconfont icon-eye1" : "eye iconfont icon-eye"} {...{ onTap: () => this.setState({ showPws: !this.state.showPws }) }}></i>
                        </div>
                    </form>
                    <a href="javascript:;" className="loginBtn" {...{ onTap: (ev) => this.handleLogin(ev) }}>登录</a>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);