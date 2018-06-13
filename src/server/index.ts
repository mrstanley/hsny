import { REMOTE } from '../config';
import { fetch } from './http';

let login = params => {
    return fetch('post', `${REMOTE}/user/appLogin`, params);
};

let dict = params => {
    return fetch('post', `${REMOTE}/dict/all`, params);
};

let main = {
    getCollectAreaList: params => {
        return fetch('post', `${REMOTE}/collectArea/list/1/10`, params);
    }
};

let message = {
    // /v1/msg/graphqlQuery
    getMessage: params => {
        return fetch('post', `${REMOTE}/msg/graphqlQuery`, params);
    }
}

// 业务数据
let serviceData = {
    serviceDataAdd: params => {
        return fetch('post', `${REMOTE}/serviceData/add`, params);
    }
};
// 虚拟表数据
let getTableData = {
    updateStateOrUseState: params => {
        return fetch('get', `${REMOTE}/virtualTable/updateStateOrUseState?state=${params.state}&tableId=${params.tableId}`);
    },
    getVirtualTableList: params => {
        let page = params.page;
        delete params.page;
        return fetch('post', `${REMOTE}/virtualTable/list/${page}/10`, params);
    },
    getVirtualTableDetailById: params => {
        return fetch('get', `${REMOTE}/virtualTable/detailById?id=${params.id}`);
    }
};

export default {
    dict,
    login,
    ...main,
    ...message,
    ...getTableData,
    ...serviceData
}