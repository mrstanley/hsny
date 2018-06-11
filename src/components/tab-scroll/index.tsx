declare const mui;

import "./index.scss";
import { h, Component } from "preact";

interface AppProps { }
interface AppState { }

export default class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
    }
    componentDidMount() {
        mui('#scroll').scroll({
            indicators: true //是否显示滚动条
        });
    }
    render(props: AppProps, state: AppState) {
        return (
            <div class="tab-scroll" id="tab-scroll">
                <div class="mui-segmented-control mui-segmented-control-inverted">
                    <a class="mui-control-item mui-active" href="#item1">数据列表</a>
                    <a class="mui-control-item" href="#item2">指标呈现</a>
                </div>
                <div class="tab-wrap">
                    <div id="item1" class="mui-control-content mui-active">
                        <div id="scroll" class="mui-scroll-wrapper">
                            <div class="mui-scroll"></div>
                        </div>
                    </div>
                    <div id="item2" class="mui-control-content"></div>
                </div>
            </div>
        );
    }
}