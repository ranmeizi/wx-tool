import useConstant from '@/hooks/useConstant';
import { ScrollView, ScrollViewProps } from '@tarojs/components';
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface InitPollToRefreshScrollViewProps extends ScrollViewProps {
  initFn(): Promise<any>;
  backtop?: React.ReactNode;
}

/**
 * 后代用
 */
const context = createContext<{
  initAction?: Promise<any>;
  setInitFn: (fn: () => Promise<any>) => void;
}>({
  initAction: undefined,
  setInitFn: () => undefined,
});

export default function InitPollToRefreshScrollView({
  initFn,
  children,
  ...scrollViewProps
}: PropsWithChildren<InitPollToRefreshScrollViewProps>) {
  const [triggered, setTriggered] = useState(false);
  const [action, setAction] = useState<Promise<any>>();
  /** 初始化函数，比较危险，他可以被 setInitFn 修改 */
  const _initFn = useRef(initFn);

  function refresh() {
    setTriggered(true);
    const initAction = _initFn.current().finally(() => setTriggered(false));
    setAction(initAction);
  }

  useEffect(() => {
    _initFn.current = initFn;
  }, [initFn]);

  return (
    <ScrollView
      {...scrollViewProps}
      scrollY
      // enhanced
      className="full-height"
      refresherEnabled
      refresherTriggered={triggered}
      onRefresherRefresh={() => refresh()}
    >
      <context.Provider
        value={{
          initAction: action,
          setInitFn: (fn) => {
            _initFn.current = fn;
          },
        }}
      >
        {children}
      </context.Provider>
    </ScrollView>
  );
}
