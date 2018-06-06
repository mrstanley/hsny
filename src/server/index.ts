import { REMOTE } from '../config';
import { fetch } from './http';

let login = params => {
    return fetch('post', `${REMOTE}/user/appLogin`, params);
}

export default {
    login
}