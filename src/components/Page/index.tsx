import { context as AppContext } from '@/contexts/AppPersist';
import useConstant from '@/hooks/useConstant';
import useForceUpdate from '@/hooks/useForceUpdate';
import wrapTrackingPage from '@/tracking/page.wrapper';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, {
  CSSProperties,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react';
import LoginModal, { LoginModalRef, OpenOptions } from './LoginModal';

export const context = React.createContext<{
  fixedViewRender: (node: FixedNodeMap) => null;
  checkLogin: (fn?: () => any) => any;
}>({
  fixedViewRender() {
    return null;
  },
  checkLogin: () => undefined,
});

type PageProps = React.PropsWithChildren<{
  className?: string;
  /** 是否为 tabview */
  tabView?: boolean;
  style?: CSSProperties;
}>;

type FixedNodeMap = {};

const Page = forwardRef(
  (
    { tabView, style = {}, className, children }: PageProps,
    ref: React.Ref<PageRef> | undefined
  ) => {
    const forceUpdate = useForceUpdate();

    // 用户信息
    const { token } = useContext(AppContext);

    // 隐私控制器
    const loginModalContrl = useRef<LoginModalRef>(null);

    const { bottom } = useConstant(() => {
      const { safeArea, screenHeight } = Taro.getSystemInfoSync();
      return {
        top: safeArea!.top,
        bottom: screenHeight - safeArea!.bottom,
      };
    });

    useImperativeHandle(ref, () => {
      return {
        fixedViewRender,
        checkLogin,
      };
    });

    const fixedNodeMap = useRef<FixedNodeMap>({});

    /**
     * ScrollView组件开启下拉刷新时，fixed 定位会有问题，所以为了这种情况我在 Page 层级 添加了一个 fixed-view
     * 页面下方的组件可以在每次更新时 调用 fixedViewRender 更新 modal 组件
     * updateNodes 一个以 key 存放节点的 map 每次会更新
     *
     * 同级使用 ref
     * 后代使用 useFixedViewRender 走 context
     */
    function fixedViewRender(updateNodes: FixedNodeMap): null {
      // 更新节点
      fixedNodeMap.current = Object.assign(fixedNodeMap.current, updateNodes);
      // forceUpdate  因为 node 值不是 state 手动刷新 Page 组件
      forceUpdate();
      return null;
    }

    /** 登陆弹窗打开 */
    function openLoginModal({ success }: OpenOptions) {
      loginModalContrl.current?.open({
        success: success,
      });
    }

    /** 检查登陆 */
    function checkLogin(successFn) {
      return token
        ? successFn && successFn()
        : openLoginModal({ success: successFn });
    }

    return (
      <View
        className={`tt-page${className ? ' ' + className : ''}`}
        catchMove
        style={{
          height: '100vh',
          paddingBottom: tabView ? `calc(135rpx + ${bottom}px)` : 0,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <LoginModal ref={loginModalContrl} />
        <context.Provider
          value={{
            fixedViewRender,
            checkLogin,
          }}
        >
          {children}
        </context.Provider>
        <View className="tt-fixed-view" style={{ height: 0, width: 0 }}>
          {Object.values(fixedNodeMap.current)}
        </View>
      </View>
    );
  }
);

export function useFixedViewRender() {
  const { fixedViewRender } = useContext(context);
  const fn =
    fixedViewRender ||
    function () {
      return null;
    };
  return fn;
}

/** 拦截登陆 */
export function useCheckLogin() {
  const { checkLogin } = useContext(context);

  return checkLogin;
}

export interface PageRef {
  fixedViewRender(updateNodes: FixedNodeMap): null;
  checkLogin(fn?: () => any): any;
}

const WrapTrackingPage = wrapTrackingPage(Page);

export default WrapTrackingPage;
