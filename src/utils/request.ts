import configs from '@/configs';
import Taro from "@tarojs/taro";
import { axios } from "taro-axios";
import { getStorage } from "./local";

const service = axios.create({
    baseURL: configs.server_base,
    timeout: 20000,
});

service.interceptors.request.use((config) => {
    const token = getStorage('token');

    if (token) {
        config.headers.Authorization = token;
    }

    return config;
});

service.interceptors.response.use(
    function (response) {

        return response;
      },
      function (error) {
    
        // 提示网络开小差了
        if (!error?.response && error?.message === 'Network Error') {
          Taro.showToast({ title: '网络开小差了,稍后再试吧!', icon: 'none' })
        }
        return Promise.reject(error);
      }
);

export default service as any;
