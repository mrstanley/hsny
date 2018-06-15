declare const plus, mui, require;

export default {
    /**
     * @description 页面相对像素值计算
     * @export
     * @param {number} a
     * @returns {string}
     */
    Px(a: number): string {
        const PX = Math.ceil(a * (plus.screen.resolutionWidth / 750));
        return PX + 'px';
    }

    /** 
     * @description 隐藏滚动条
     * @export
     */
    , hideScroll() {
        plus.webview.currentWebview().setStyle({
            scrollIndicator: "none"
        });
    }

    /**
     * @description 初始化安卓手机返回按钮行为
     * @export
     */
    , appBack(): void {
        let first: number = 0;
        mui.back = () => {
            if (!first) {
                mui.toast("再按一次退出");
                first++;
                setTimeout(() => {
                    first = 0;
                }, 1500);
            } else {
                plus.runtime.quit();
            }
        };
    }

    /**
     *@description 判断是否全屏，返回状态栏高度
     * @export
     * @returns
     */
    , getImmersed() {
        let immersed = 0;
        const ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
        if (ms && ms.length >= 3) {
            immersed = parseFloat(ms[2]);
        }
        if (immersed) {
            return immersed;
        } else if (plus.navigator.isImmersedStatusbar()) {
            return plus.navigator.getStatusbarHeight();
        } else {
            return 0;
        }
    }

    /**
     * @description 缩放尺寸
     * @export
     * @returns
     */
    , getRootSize() {
        return Math.ceil(window.screen.availWidth / 7.5);
    }

    /**
     * @description 顶部状态栏高度 区分首页和内页不同处理
     * @param {String|null} str 顶部状态栏颜色
     */
    , setImmersed() {
        const r = this.getRootSize();
        const immersed = this.getImmersed();
        if (immersed) {
            let t: Element | any = (document.querySelector(".mui-bar") || document.querySelector(".app-header"));
            t && (t.style.paddingTop = immersed + "px", t.style.height = (.9 * r + immersed) + "px");
            t = document.querySelector(".mui-content") || document.querySelector(".app-content");
            t && (t.style.paddingTop = (.9 * r + immersed) + "px");
        }
    }

    /**
     * @description 创建原生图片控件
     * @export
     * @param {*} id 控件标识ID
     * @param {*} styles 控件样式选项
     * @param {*} url 图片地址
     * @returns
     */
    , createImgBtnView(id, styles, url) {
        return new plus.nativeObj.View(id, styles, [
            { tag: 'img', id: id + 'Img', src: url },
        ]);
    }


    /**
     * @description 打开新页面如果页面已经打开，则显示页面
     * @param {String|Object} 要打开页面的ID
     */
    , openPage(page: string, param: any = {}, showedCB?): void {
        const tmp = plus.webview.getWebviewById(page);
        const ios = plus.os.name.toLowerCase() === "ios";
        const moveType = ios ? "pop-in" : "slide-in-right";
        if (tmp && !param.createNew) {
            tmp.show(moveType, 250, showedCB);
        } else {
            const options: any = {
                url: "../" + page + "/index.html",
                id: param.createNew ? `new_${Date.now()}_` + page : page,
                show: {
                    aniShow: moveType,
                    duration: 250,
                    event: "loaded"
                },
                styles: {
                    hardwareAccelerated: true,
                    popGesture: "close"
                },
                waiting: {
                    autoShow: false
                },
                extras: param
            };
            param.createNew && (options.createNew = true);
            mui.openWindow(options);
        }
    }
    , handleBack(cb?: Function) {
        let back = mui.back;
        let style = "light";
        mui.back = () => {
            if (plus.webview.currentWebview().from.barStyle == "dark")
                style = "dark"
            mui.later(() => {
                plus.navigator.setStatusBarStyle(style);
            }, 200);
            cb && cb();
            back();
        }
    }
}