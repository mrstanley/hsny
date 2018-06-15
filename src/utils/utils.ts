declare const plus, mui, require;

import { ROOT, REMOTE } from "../config"
export default {
    /**
     * @description 图片居中
     * @param {*} ev
     */
    handleImgLoad(ev) {
        if (ev.target) {
            let height = ev.target.offsetHeight - ev.target.parentNode.offsetHeight;
            ev.target.style.marginTop = -(height / 2) + "px";
        }
    }
    // 存取 cookie
    , setCookie(key: string, value: string, time?: number): void {
        const expires: any = new Date(Date.now() + (!!value ? (time || 24) * 3600000 : 0));
        key && plus.navigator.setCookie(ROOT, key + "=" + value + "; expires=" + expires.toGMTString().replace(" ", "") + "; path=/");
    }
    , getCookie(key: string): string {
        const cookieStr = plus.navigator.getCookie(ROOT);
        const cookieArray = cookieStr && cookieStr.split("; ");
        const cookieValue = cookieArray && cookieArray.find((i) => i.indexOf(key) >= 0);
        if (cookieValue) {
            return cookieValue.split("=")[1];
        } else {
            return key ? "" : plus.navigator.getCookie(ROOT);
        }
    }
    // 存取数据
    , setSettings(attr: string, val: any): void {
        const settings = this.getSettings();
        attr && JSON.stringify(val) ? settings[attr] = val : "";
        plus.storage.setItem("DATA_SETTING", JSON.stringify(settings));
    }
    , getSettings(attr?: string) {
        const settingsText = plus.storage.getItem("DATA_SETTING") || "{}";
        return (attr && typeof attr === "string" ? (JSON.parse(settingsText)[attr] || '') : JSON.parse(settingsText));
    }
}