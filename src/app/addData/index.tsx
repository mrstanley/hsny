declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import Utils from "../../utils";
import Service from "../../server";

interface AppProps { }
interface AppState {
    title: string;
    data: any;
    fields: any[];
    loading: boolean;
    inputType: object;
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    public init;
    public view;
    constructor(props: AppProps) {
        super(props);
        this.state = {
            title: "", data: {}, loading: true, fields: [],
            inputType: {
                "901": "text",
                "902": "number",
                "903": "date"
            }
        };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            this.setState({ title: this.view.table.collectAreaName });
            this.getTableDetail();
            console.log(JSON.stringify(this.view.table));
        });
    }
    getTableDetail() {
        let { id } = this.view.table;
        Service.getVirtualTableDetailById({ id }).then((data: any) => {
            this.initfieldsData(data.virtualColAddVos);
        }).catch(error => {
            this.setState({ loading: false });
        });
    }
    initfieldsData(fieldsList: any[]) {
        let fields = fieldsList.map(item => {
            let fieldsData: any = {
                name: item.name,
                type: this.state.inputType[item.type],
                value: ""
            };
            if (item.param) {
                fieldsData.param = item.param;
                fieldsData.type = "select";
            }
            return fieldsData;
        });
        this.setState({ loading: false, fields });
    }
    componentDidMount() {
        Utils.setImmersed();
    }
    // 封装数据更新工具函数
    updateFieldsData(index, data) {
        let list = this.state.fields;
        let fields = [...list.slice(0, index), { ...list[index], ...data }, ...list.slice(index + 1)];
        this.setState({ fields });
    }
    handleInput(ev, index) {
        let value = ev.target.value;
        this.updateFieldsData(index, { value });
    }
    render(props: AppProps, state: AppState) {
        let { title, data, fields, loading } = state;
        return (
            <div className="app-container addData">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">添加{title}</h1>
                </header>
                <div className="mui-content">
                    <div className="fields">
                        {fields.length > 0 ? fields.map((item, index) => (
                            <div className="fields-item">
                                <div className="fields-label">{item.name}</div>
                                <div className="fields-input">
                                    {item.type == "select" ? (
                                        <select name="" id=""></select>
                                    ) : (
                                            <input type={item.type} value={item.value} onInput={(ev) => this.handleInput(ev, index)} placeholder={`请输入${item.name}`} />
                                        )}
                                </div>
                            </div>
                        )) : <div className="app-table-noData">{loading ? "初始化中..." : "暂无字段信息"}</div>}
                        <div className="fields-btns">
                            <div className="btn">继续添加</div>
                            <div className="btn block">完成添加</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);