import { cloud } from '@tarojs/taro';
import axios, { AxiosHeaders, AxiosRequestConfig } from 'axios';
import settle from '../../../node_modules/axios/lib/core/settle';

const instance = axios.create({
  adapter: cloudAdapter,
});

export default instance;

// 请求云托管的适配器
function cloudAdapter(config: AxiosRequestConfig): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const request: any = {
      config: {
        env: 'prod-7g2acur2ee3f2b4e', // 微信云托管的环境ID
      },
      path: config.url || '',
      method: config.method,
      data: config.data,
      header: {
        'X-WX-SERVICE': 'rust',
        ...config.headers,
      },
      timeout: config.timeout || 15000,
      responseType:
        config.responseType === 'blob' && 'arraybuffer'
          ? 'arraybuffer'
          : 'text',
    };

    cloud
      .callContainer(request)
      .then((res) => {
        const response = {
          status: res.statusCode,
          config: config,
          headers: new AxiosHeaders(res.header),
          request: request,
          data: res.data,
        };

        settle(resolve, reject, response);
      })
      .catch(reject);
  });
}
