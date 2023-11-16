import { useRef, useContext } from 'react';
import { BaseEventOrig, ButtonProps } from '@tarojs/components';
import { wxCodeCache } from '@/utils/cacheManage';
import TA from '@/tracking';
import { sleep } from '@/utils/delay';
import { context } from '@/contexts/AppPersist';
import Taro from '@tarojs/taro';
// import { requestPhoneLogin } from '@/services/common';

function requestPhoneLogin(params: any) {
  return Promise.resolve({
    data: {
      code: 200,
      result: {
        token: '1234567',
      },
    },
  });
}

export default function usePhoneLogin(successFn) {
  const { setToken, getUserInfo } = useContext(context);

  async function onGetPhoneNumber(
    e: BaseEventOrig<ButtonProps.onGetPhoneNumberEventDetail>
  ) {
    console.log(e);
    if (e?.detail?.errMsg.indexOf('ok') !== -1) {
      // login
      Taro.showLoading({
        title: '登陆中,请稍后',
        mask: true,
      });
      try {
        const _params = {
          code: await wxCodeCache.get(),
          ad_info: Taro.getStorageSync('ad_info'),
          phone_code: e.detail.code,
        };
        const res = await requestPhoneLogin(_params);

        wxCodeCache.clear();

        if (res.data.code === 200) {
          // 更新token
          setToken(res.data.result.token);

          // 等待 state 更新
          await sleep(30);
          // 更新userinfo
          await getUserInfo();

          // 成功埋点
          TA.track({
            pageid: 'phoneAuthPop',
            event: 'succ',
          });

          successFn && successFn();
        }
      } catch (e) {
        console.log('onGetPhoneNumber', e);
        Taro.hideLoading();
      } finally {
        Taro.hideLoading();
      }
    } else {
      Taro.showToast({
        title: '已取消手机号授权',
        icon: 'none',
      });

      // 失败埋点
      TA.track({
        pageid: 'phoneAuthPop',
        event: 'fail',
      });
    }
  }
  return onGetPhoneNumber;
}
