declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import Utils from "../../utils";
import Service from "../../server";

interface AppProps { }
interface AppState {
    description: any;
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    public view;
    constructor(props: AppProps) {
        super(props);
        this.state = { description: null };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            this.setState({ description: this.view.table });
            this.getData();
        });
    }
    getData() {
        Service.getTableDesc({ id: this.view.table.parentTableId }).then((data: any) => {
            this.setState({ description: data.description });
        })
    }
    componentDidMount() {
        Utils.setImmersed();
    }
    render(props: AppProps, state: AppState) {
        let { description } = state;
        return (
            <div className="app-container tableHelp">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">填写说明</h1>
                </header>
                <div className="mui-content">
                    <div className="tableHelp-context" dangerouslySetInnerHTML={{ __html: description || '暂无内容' }}></div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);