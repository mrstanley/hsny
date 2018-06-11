import { REMOTE } from '../config';
import { fetch } from './http';

let login = params => {
    return fetch('post', `${REMOTE}/user/appLogin`, params);
}

let main = {
    getCollectAreaList: params => {
        return fetch('post', `${REMOTE}/collectArea/list/1/10`, params);
    }
}

export default {
    login,
    ...main
}