import axios from "axios";
import { getToken } from "./getToken";
import { Message } from 'element-ui';
import store from '../store/index'
const service = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000
});
service.interceptors.request.use(
    config => {

        if (getToken()) {
            //添加请求头
            config.headers.Authorization = getToken();
        }
        return config
    },
    error => Promise.reject(error)

)

service.interceptors.response.use(
    response => {
        const res = response.data;
        if (![200, 201].includes(response.status)) {
            return Promise.reject(new Error(res.message || 'Error'));
        }
        return res;
    },
    error => {
        console.log('error', { error });
        if (error.message === 'timeout of 3000ms exceeded') {
            Message.error('请求超时,请检查你的网络状态或重新请求')
        }
        //对服务端进行错误解析
        const { status, data } = error.response;
        const { code, message } = data;
        if (status === 500) {
            store.commit('resetStore');
            store.dispatch('logout');
            return;
        }
        if (code === 401) {
            Message.error(`身份信息校验失败、请重新登录`);
            store.dispatch('logout')
        } else {
            Message.error(message)
        }
        return Promise.reject(error);
    }
)
export default service