import { REMOTE } from '../config';
import { fetch } from './http';

// 登录
let login = params => fetch('post', `${REMOTE}/user/appLogin`, params);

// 码表
let dict = params => fetch('post', `${REMOTE}/dict/all`, params);

// 主页
let main = {
    getCollectAreaList: params => fetch('post', `${REMOTE}/collectArea/list/1/10`, params)
};

// 消息
let message = {
    getMessage: params => fetch('post', `${REMOTE}/msg/graphqlQuery`, params)
}

// 业务数据
let serviceData = {
    serviceDataAdd: params => fetch('post', `${REMOTE}/serviceData/add`, params),
    serviceDataList: params => {
        let page = params.page;
        delete params.page;
        return fetch('post', `${REMOTE}/serviceData/list/${page}/10`, params);
    },
    // 上传
    serviceDataUpload: params => fetch('get', `${REMOTE}/serviceData/serviceDataUpload?tableId=${params.tableId}`),
    // 查询业务数据
    serviceDataDetailById: params => fetch('get', `${REMOTE}/serviceData/detailById?id=${params.id}`),
    // 更新
    serviceDataUpdate: params => fetch('post', `${REMOTE}/serviceData/update`, params)
};

// 虚拟表数据
let getTableData = {
    updateStateOrUseState: params => fetch('get', `${REMOTE}/virtualTable/updateStateOrUseState?state=${params.state}&tableId=${params.tableId}`),
    getVirtualTableList: params => {
        let page = params.page;
        delete params.page;
        return fetch('post', `${REMOTE}/virtualTable/list/${page}/10`, params);
    },
    getVirtualTableDetailById: params => fetch('get', `${REMOTE}/virtualTable/detailById?id=${params.id}`),
    appPersonCenterStatictics: params => fetch('get', `${REMOTE}/virtualTable/appPersonCenterStatictics`)
};

// 可视化统计图表(指标呈现)
let visualStatistic = {
    equipManage: params => fetch('get', `${REMOTE}/visualStatistic/equipManage?devAddr=${params.devAddr}`),
    farmingManage: params => fetch('get', `${REMOTE}/visualStatistic/farmingManage?devAddr=${params.devAddr}`)
}

// farming 农业基地

let farmingBase = {
    // /v1/farmingBase/list/{page}/{size}
    farmingBaseList: params => {
        let page = params.page;
        delete params.page;
        return fetch('post', `${REMOTE}/farmingBase/list/${page}/10`, params);
    }
}


export default {
    dict,
    login,
    ...main,
    ...message,
    ...getTableData,
    ...serviceData,
    ...visualStatistic,
    ...farmingBase
}