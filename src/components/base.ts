declare const plus, mui, require;

export default {
    view: null,
    /**
     * view 事件监听
     *
     * @param {string} eName
     * @param {EventListener} ev
     */
    listener(eName: string, ev: EventListener) {
        mui.plusReady(() => {
            window.addEventListener(eName, ev);
        });
    },
    /**
     * view Ready监听
     *
     * @param {Function} [cb] 初始化回调
     */
    init(cb?: Function) {
        mui.plusReady(() => {
            this.view = plus.webview.currentWebview();
            cb && cb();
        })
    }
}