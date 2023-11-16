import Taro from '@tarojs/taro';
import { PropsWithChildren, createContext, PureComponent } from 'react';

const PERSIST_KEY = 'app-persist';

export interface IAppContext {
  token: string;
  setToken(v: string): void;
  /** 获取用户信息 */
  getUserInfo(): void;
  userInfo: {};
}

const defaultValue: IAppContext = {
  token: '',
  userInfo: {},
  getUserInfo: () => undefined,
  setToken: () => undefined,
};

export const context = createContext(defaultValue);

export class Provider extends PureComponent<PropsWithChildren> {
  state = {
    token: '',
    userInfo: {},
  };

  componentDidMount() {
    Taro.getStorage({
      key: PERSIST_KEY,
      success: (result) => {
        console.log('init', result);
        this.setState({ ...result.data });
      },
    });
  }

  /** 获取用户信息，存到 state ,设置埋点信息*/
  async getUserInfo() {
    const res = {
      data: {
        result: {
          name: '张三',
        },
      },
    };
    /** 获取登陆状态 或 清空登陆状态 */
    this._setStorage({
      userInfo: res.data.result,
    });
    return res;
  }

  setToken(token: string) {
    this._setStorage({ token });
  }

  /**
   * 往 storage 里存一份
   */
  private _setStorage: typeof this.setState = (data: any) => {
    this.setState(data, () => {
      Taro.setStorageSync(PERSIST_KEY, this.state);
    });
  };

  render() {
    const { token, userInfo } = this.state;
    const { children } = this.props;
    return (
      <context.Provider
        value={{
          token,
          userInfo,
          getUserInfo: this.getUserInfo.bind(this),
          setToken: this.setToken.bind(this),
        }}
      >
        {children}
      </context.Provider>
    );
  }
}
