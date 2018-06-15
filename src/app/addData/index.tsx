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
    public picker;
    public datePicker;
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
            this.setState({ title: this.view.table.anotherName });
            this.getTableDetail();
        });
    }
    getRecordDetail(id) {
        Service.serviceDataDetailById({ id }).then((data: any) => {
            let values = JSON.parse(data.value);
            this.state.fields.forEach((item: any, index: number) => {
                if (typeof values[item.name] != "undefined") {
                    this.updateFieldsData(index, { value: values[item.name] });
                }
            });
        })
    }
    getTableDetail() {
        let { id } = this.view.table;
        Service.getVirtualTableDetailById({ id }).then((data: any) => {
            this.initfieldsData(data.virtualColAddVos);
            if (this.view.recordId) {
                this.getRecordDetail(this.view.recordId);
            }
        }).catch(error => {
            this.setState({ loading: false });
        });
    }
    initfieldsData(fieldsList: any[]) {
        let fields = fieldsList.map(item => {
            let fieldsData: any = {
                name: item.name,
                required: !!item.isRequired,
                type: this.state.inputType[item.type],
                value: ""
            };
            if (item.param) {
                fieldsData.param = item.param.split(",");
                fieldsData.type = "select";
            }
            return fieldsData;
        });
        this.setState({ loading: false, fields });
    }
    componentDidMount() {
        Utils.setImmersed();
        this.picker = new mui.PopPicker();
        this.datePicker = new mui.DtPicker();
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
    handSelect(ev, index) {
        let items = this.state.fields[index].param.map(item => {
            return { value: item, text: item }
        })
        this.picker.setData(items);
        this.picker.show((selectItems) => {
            this.updateFieldsData(index, { value: selectItems[0].value });
        });
    }
    handDate(ev, index) {
        this.datePicker.show((selectItems) => {
            let { value } = selectItems;
            this.updateFieldsData(index, { value });
        });
    }
    validate() {
        for (let i = 0; i < this.state.fields.length; i++) {
            const item = this.state.fields[i];
            if (item.required && !item.value) {
                mui.toast(`${item.name}为必填项`)
                return false;
            }
        }
        return true;
    }
    formartData() {
        let data = {};
        this.state.fields.forEach(item => {
            if (item.value) {
                data[item.name] = item.value;
            }
        });
        return JSON.stringify(data);
    }
    async saveData(params) {
        let tableId = params.virtualTableId;
        try {
            if (!this.view.recordId) {
                await Service.serviceDataAdd(params);
            } else {
                await Service.serviceDataUpdate({
                    id: this.view.recordId,
                    ...params
                })
            }
        } catch (error) {
            mui.toast(`${this.view.recordId ? "更新" : "添加"}数据失败`);
        }
        await Service.updateStateOrUseState({
            state: 1003,
            tableId
        });
        mui.fire(plus.webview.getWebviewById(this.view.table.viewId), "reloadData");
        mui.back();
    }
    handComplete() {
        let isValidate = this.validate();
        if (isValidate) {
            plus.nativeUI.confirm(`确认${this.view.recordId ? "更新" : "添加"}？`, ({ index }) => {
                if (index == 0) {
                    let value = this.formartData();
                    let { id } = this.view.table;
                    this.saveData({
                        value,
                        virtualTableId: id
                    });
                }
            });
        }
    }
    render(props: AppProps, state: AppState) {
        let { title, fields, loading } = state;
        return (
            <div className="app-container addData">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">{this.view && this.view.recordId ? "编辑" : "添加"}表数据</h1>
                </header>
                <div className="mui-content">
                    <div className="fields">
                        {fields.length > 0 ? fields.map((item, index) => (
                            <div className="fields-item">
                                <div className="fields-label">{item.name}</div>
                                <div className="fields-input">
                                    {item.type == "select" && (
                                        <input type="text" readOnly value={item.value} {...{ onTap: (ev) => this.handSelect(ev, index) }} placeholder={`请点击列表选择`} />
                                    )}
                                    {(item.type == "date") && (
                                        <input type="text" readOnly value={item.value} {...{ onTap: (ev) => this.handDate(ev, index) }} placeholder={`请选择日期值`} />
                                    )}
                                    {(item.type == "text" || item.type == "number") && (
                                        <input type={item.type} value={item.value} onInput={(ev) => this.handleInput(ev, index)} placeholder={`请输入字段的值`} />
                                    )}
                                </div>
                            </div>
                        )) : <div className="fields-noData">{loading ? "初始化中..." : "暂无字段信息"}</div>}
                        {fields.length > 0 && (
                            <div className="fields-btns">
                                <div className="btn" {...{ onTap: () => Utils.openPage("addData", { table: this.view.table, createNew: true }) }}>继续添加</div>
                                <div className="btn block" {...{ onTap: this.handComplete.bind(this) }}>完成{this.view && this.view.recordId ? "编辑" : "添加"}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);