import useForceUpdate from '@/hooks/useForceUpdate';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { PropsWithChildren, useEffect, useRef } from 'react';

function Mask() {
  return (
    <View
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        zIndex: 1000,
        pointerEvents: 'none',
        background: 'rgba(0,0,0,.6)',
      }}
    />
  );
}

interface FocusMaskProps {
  selector: string;
  onFocusClick?: () => void;
}

function FocusMask({
  selector,
  children,
  onFocusClick,
}: PropsWithChildren<FocusMaskProps>) {
  const windowInfo = Taro.getSystemInfoSync();

  const rect = useRef<any>({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 0,
    width: 0,
  });
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    setTimeout(() => {
      const pageInstance =
        Taro.getCurrentPages()[Taro.getCurrentPages().length - 1];
      const query = Taro.createSelectorQuery().in(pageInstance);
      query.select(selector).boundingClientRect((res: any) => {
        rect.current = res;
        forceUpdate();
      });
      query.exec();
    }, 50);
  }, []);

  function onClick(e?: any) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  return (
    <View
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        zIndex: 1000,
        pointerEvents: 'none',
        touchAction: 'none',
      }}
      catchMove
    >
      {/* 上 */}
      <View
        onClick={onClick}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: rect.current.top + 'px',
          width: '100vw',
          background: 'rgba(0,0,0,.6)',
          pointerEvents: 'auto',
        }}
      />
      {/* 右 */}
      <View
        onClick={onClick}
        style={{
          position: 'absolute',
          top: rect.current.top,
          bottom:
            windowInfo.screenHeight -
            rect.current.top -
            rect.current.height +
            'px',
          left: rect.current.left + rect.current.width + 'px',
          width:
            windowInfo.screenWidth -
            rect.current.left -
            rect.current.width +
            'px',
          background: 'rgba(0,0,0,.6)',
          pointerEvents: 'auto',
        }}
      />
      {/* 下 */}
      <View
        onClick={onClick}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height:
            windowInfo.screenHeight -
            rect.current.top -
            rect.current.height +
            'px',
          width: '100vw',
          background: 'rgba(0,0,0,.6)',
          pointerEvents: 'auto',
        }}
      />
      {/* 左 */}
      <View
        onClick={onClick}
        style={{
          position: 'absolute',
          top: rect.current.top + 'px',
          bottom:
            windowInfo.screenHeight -
            rect.current.top -
            rect.current.height +
            'px',
          left: 0,
          width: rect.current.left + 'px',
          background: 'rgba(0,0,0,.6)',
          pointerEvents: 'auto',
        }}
      />
      <View
        style={{
          position: 'relative',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
        }}
      >
        {children}
      </View>
    </View>
  );
}

export { FocusMask, Mask };
