declare const plus, mui;

export default {
    /**
     * view 事件监听
     * @param {string} eName
     * @param {EventListener} ev
     */
    listener(eName: string, ev: EventListener) {
        mui.plusReady(() => {
            window.addEventListener(eName, ev);
        });
    },
    /**
     * view ready监听
     * @param {Function} [cb] 初始化回调
     */
    init(cb?: Function) {
        mui.plusReady(() => {
            this.view = plus.webview.currentWebview();
            window.document.title = this.view.id;
            cb && cb();
        })
    }
}