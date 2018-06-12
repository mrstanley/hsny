import { REMOTE } from '../config';
import { fetch } from './http';

let login = params => {
    return fetch('post', `${REMOTE}/user/appLogin`, params);
}

let dict = params => {
    return fetch('post', `${REMOTE}/dict/all`, params);
}

let main = {
    getCollectAreaList: params => {
        return fetch('post', `${REMOTE}/collectArea/list/1/10`, params);
    }
}

let getTableData = {
    getVirtualTableList: params => {
        let page = params.page;
        delete params.page;
        return fetch('post', `${REMOTE}/virtualTable/list/${page}/10`, params);
    },
    getVirtualTableDetailById: params => {
        return fetch('get', `${REMOTE}/virtualTable/detailById?id=${params.id}`);
    }
}

export default {
    dict,
    login,
    ...main,
    ...getTableData
}