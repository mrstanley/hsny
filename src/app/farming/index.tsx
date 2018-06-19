declare const plus, mui, require;

import { h, render, Component } from "preact";
import Mixins from "../../components/base";
import TabScroll from "../../components/tab-scroll";
import Table from "../../components/table";
import Utils from "../../utils";
import Service from "../../server";
let echarts = require("echarts");

interface AppProps { }
interface AppState {
    loading: boolean;
    collectAreaId: string;
    farmingBase: any[];
    chartData: any;
    charShow: boolean;
}

export default class App extends Component<AppProps, AppState> {
    mixins = [Mixins];
    init: Function;
    public view;
    constructor(props: AppProps) {
        super(props);
        this.state = { loading: true, collectAreaId: "", farmingBase: [], chartData: null, charShow: false };
        this.mixins.forEach(m => Object.assign(this, m));
        this.init(() => {
            let { collectAreaId } = this.view.params;
            this.setState({ collectAreaId });
            plus.navigator.setStatusBarStyle("light");
            Utils.hideScroll();
        });
    }
    async getChartData() {
        let userInfo = Utils.getSettings("userInfo");
        let farmingBasePromise = Service.farmingBaseList({ page: 1 });
        let chartDataPromise = Service.farmingManage({ devAddr: userInfo.farmingBaseId });
        let list: any = await farmingBasePromise.catch(() => {
            this.setState({ loading: false });
        });
        let chartData: any = await chartDataPromise.catch(() => {
            this.setState({ loading: false });
        });
        this.setState({ loading: false, farmingBase: list.pageData, chartData });
    }
    getFarmingBaseByid(id) {
        let obj = this.state.farmingBase.find(item => item.id == id);
        return obj && obj.name || "暂无";
    }
    componentDidMount() {
        Utils.setImmersed();
        Utils.handleBack();
    }
    handleChart1(ref: HTMLElement, data) {
        let [titleText, value] = data;
        setTimeout(() => {
            echarts.init(ref).setOption({
                title: {
                    text: titleText,
                    left: "center",
                    bottom: "4%",
                    textStyle: {
                        color: '#999999',
                        fontSize: 14
                    }
                },
                series: [{
                    name: '红实二号',
                    type: 'pie',
                    itemStyle: {
                        color: "#7FCF5C"
                    },
                    center: ['50%', '40%'],
                    labelLine: {
                        length: 3,
                        length2: 12,
                        smooth: true
                    },
                    data: [{
                        value,
                        name: Math.round(value * 100) + "%"
                    }]
                }]
            })
        }, 500)
    }
    pullToRefresh(ref) {
        let self = this;
        mui(ref).pullToRefresh({
            down: {
                height: 150,
                callback: function () {
                    self.getChartData();
                    setTimeout(() => {
                        this.endPullDownToRefresh();
                    }, 1000);
                }
            }
        })
    }
    onCharShow() {
        if (!this.state.charShow) {
            this.getChartData();
            this.setState({ charShow: true });
        }
    }
    render(props: AppProps, state: AppState) {
        let { collectAreaId, loading, chartData } = state;
        return (
            <div className="app-container farming">
                <header id="header" class="mui-bar mui-bar-nav">
                    <span class="mui-action-back iconfont icon-back mui-pull-left"></span>
                    <h1 class="mui-title">农事活动管理</h1>
                </header>
                <div class="mui-content">
                    <TabScroll onCharShow={this.onCharShow.bind(this)}>
                        <Table collectAreaId={collectAreaId}></Table>
                        <div className="chart">
                            {!loading && chartData && (
                                <div id="scroll2" ref={(ref) => mui(ref).scroll({ bounce: false })} class="mui-scroll-wrapper">
                                    <div className="mui-scroll" ref={this.pullToRefresh.bind(this)}>
                                        <div className="chart-panel">
                                            <div className="chart-panel-header">套袋合格率</div>
                                            <div className="chart-panel-item">
                                                {chartData.baggingQualified.RowDataSet.length > 0 ? (
                                                    <div className="bagging-wrap">
                                                        {chartData.baggingQualified.RowDataSet.map((item: any[]) => {
                                                            let [id, percent] = item;
                                                            return (
                                                                <div className="bagging-item">
                                                                    <label>{this.getFarmingBaseByid(id)}</label>
                                                                    <span className="text">{Math.round(percent * 100) + "%"}</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (<div className="noData">暂无数据</div>)}
                                            </div>
                                        </div>
                                        <div className="chart-panel">
                                            <div className="chart-panel-header">蔬果检查</div>
                                            <div className="chart-panel-item">
                                                {chartData.fruitCheck.RowDataSet.length > 0 ? (
                                                    <div className="pipe-wrap">
                                                        {chartData.fruitCheck.RowDataSet.map((item: any[]) => (
                                                            <div className="pipe-item" ref={(ref) => this.handleChart1(ref, item)} id="chart1"></div>
                                                        ))}
                                                    </div>
                                                ) : (< div className="noData" >暂无数据</div>)}
                                            </div>
                                        </div>
                                        <div className="chart-panel">
                                            <div className="chart-panel-header">冬季修剪质量验收</div>
                                            <div className="chart-panel-item">
                                                {chartData.trimCheck.RowDataSet.length > 0 ? (
                                                    <div className="bagging-wrap">
                                                        {chartData.trimCheck.RowDataSet.map((item: any[]) => {
                                                            let [id, value] = item;
                                                            return (
                                                                <div className="bagging-item">
                                                                    <label>{this.getFarmingBaseByid(id)}</label>
                                                                    <span className="text">{parseInt(value)}</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (<div className="noData">暂无数据</div>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!loading && !chartData && (<div className="noData">暂无数据</div>)}
                            {loading && (<div className="loading">加载中...</div>)}
                        </div>
                    </TabScroll>
                </div>
            </div>
        );
    }
}

render(<App />, document.body);