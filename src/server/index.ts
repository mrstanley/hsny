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
    },
    serviceDataList: params => {
        let page = params.page;
        delete params.page;
        return fetch('post', `${REMOTE}/serviceData/list/${page}/10`, params);
    },
    // /v1/serviceData/serviceDataUpload 上传
    serviceDataUpload: params => {
        return fetch('get', `${REMOTE}/serviceData/serviceDataUpload?tableId=${params.tableId}`);
    },
    // /v1/serviceData/detailById 查询业务数据
    serviceDataDetailById: params => {
        return fetch('get', `${REMOTE}/serviceData/detailById?id=${params.id}`);
    },
    // /v1/serviceData/update
    serviceDataUpdate: params => {
        return fetch('post', `${REMOTE}/serviceData/update`, params);
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
    },
    // /v1/virtualTable/appPersonCenterStatictics
    appPersonCenterStatictics: params => {
        return fetch('get', `${REMOTE}/virtualTable/appPersonCenterStatictics`);
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