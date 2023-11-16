import Taro from '@tarojs/taro';

interface ICacheMangeConfig {
  name: string; // 缓存名称
  expireDuration: number; // 缓存有效时间长度
  /** 缓存失效时，获取新数据的方法 */
  newDataFunc: () => any;
}

class CacheManage<T> {
  _data: any;
  name: string;
  expireDate: number;
  expireDuration: number;
  newDataFunc: () => any;
  isLoading: boolean;

  constructor(props: ICacheMangeConfig) {
    this._data = null;
    this.isLoading = false;
    this.expireDate = 0;
    this.name = props.name;
    this.expireDuration = props.expireDuration;
    this.newDataFunc = props.newDataFunc;
  }

  get(): Promise<T> {
    if (this.isLoading) {
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve(this.get());
        }, 100)
      );
    }
    if (this._data !== null && this.expireDate > Date.now()) {
      return Promise.resolve(this._data);
    } else {
      this.isLoading = true;
      return Promise.resolve(this.newDataFunc())
        .then((res) => {
          this.isLoading = false;
          this._data = res;
          this.expireDate = Date.now() + this.expireDuration;

          return res;
        })
        .catch((er) => {
          this.isLoading = false;

          this._data = null;
          console.error(`cache mange ${this.name} get fail \n`, er);
          throw er;
        });
    }
  }

  clear() {
    this.expireDate = 0;
    this.isLoading = false;
    this._data = null;
  }
}

export default CacheManage;

// 下面写需要缓存的变量对象

/** 缓存 code */
export const wxCodeCache = new CacheManage<string>({
  name: 'wx-jscode',
  expireDuration: 1000 * 60 * 5, // jscode 有效期5分钟，需要在调用任何使用code的api后清空cache
  newDataFunc() {
    return new Promise((resolve, reject) => {
      Taro.login({
        success(res) {
          resolve(res.code);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },
});
