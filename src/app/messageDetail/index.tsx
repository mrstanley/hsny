declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import Utils from "../../utils";
import Service from "../../server";

interface AppProps { }
interface AppState {
    msg: any;
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    public view;
    constructor(props: AppProps) {
        super(props);
        this.state = { msg: {} };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            let msgId = this.view.msgId;
            Service.getMessage({
                query: `{msg(id:${msgId}){queryAll}}`
            }).then((data: any) => {
                this.setState({ msg: data.msg });
            });
        });
    }
    componentDidMount() {
        Utils.setImmersed();
    }
    render(props: AppProps, state: AppState) {
        let { msg } = state;
        return (
            <div className="app-container messageDetail">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">{msg.title}</h1>
                </header>
                <div className="mui-content">
                    <div className="context">
                        {msg.content};
                    </div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);