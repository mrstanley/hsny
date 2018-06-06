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
        this.init();
        mui.init();
    }
    componentDidMount() {
        Utils.setImmersed();
    }
    render(props: AppProps, state: AppState) {
        return (
            <div className="app-container login">
                <div className="login-form">
                    <div className="logo">
                        <img src={require("../../assets/images/192x192.png")} alt="华盛农业" />
                    </div>
                    <form>
                        <div className="item">
                            <i className="iconfont icon-Accountnumber"></i>
                            <input type="text" placeholder="请输入账号" />
                        </div>
                        <div className="item">
                            <i className="iconfont icon-Password"></i>
                            <input type="password" placeholder="请输入密码" />
                        </div>
                    </form>
                    <a href="" className="loginBtn">登录</a>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);