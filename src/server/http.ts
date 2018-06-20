import Utils from "../utils"

export function notice(code, content) {
    switch (code) {
        case 401:
            mui.toast("登录已过期，请重新登陆", { duration: 3 });
            Utils.openPage("login", { from: { barStyle: "dark" } });
            Utils.setCookie("authorization", null);
            break;
        case 403:
            mui.toast(content || "无访问权限", { duration: 3 });
            break;
        case 404:
            mui.toast(content || "找不到资源", { duration: 3 });
            break;
        case 409:
            mui.toast(content || "操作冲突", { duration: 3 });
            break;
        case 500:
        case 502:
            mui.toast(content || "服务器内部错误", { duration: 3 });
            break;
        case 504:
            mui.toast(content || "访问服务器超时", { duration: 3 });
            break;
        case 9998:
            mui.toast(content || "需要修改的完成状态不能与原状态一致", { duration: 3 });
            break;
        default:
            mui.toast(content || "未知错误", { duration: 3 });
            break;
    }
}


export function fetch(type, url, params?) {
    type = type.toLocaleLowerCase();
    return new Promise((resolve, reject) => {
        mui.ajax(url, {
            data: params,
            dataType: 'json',
            type,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                Authorization: Utils.getCookie("authorization") || ""
            },
            success: (res) => {
                let { data, errorCode, msg } = res;
                if (errorCode == 0) {
                    resolve(data);
                } else {
                    if (errorCode) {
                        notice(errorCode, msg || JSON.stringify(data));
                        reject();
                    } else {
                        resolve(res);
                    }
                }
            },
            error: (error, type, errorThrown) => {
                if (error.response) {
                    let errorStatusCode = error.response.status;
                    let statusText = error.response.statusText;
                    if (typeof error.response.data == "object") {
                        let { data, errorCode, msg } = error.response;
                        errorCode ? notice(errorCode, msg) : notice(500, null);
                    } else {
                        notice(errorStatusCode, null);
                    }
                } else {
                    notice(error.status || 504, null);
                }
                reject(error);
            }
        });
    });
}