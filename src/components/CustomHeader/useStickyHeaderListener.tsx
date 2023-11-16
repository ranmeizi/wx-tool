import { useState } from 'react';
import { BaseEventOrig, ScrollViewProps } from '@tarojs/components';
import useConstant from '@/hooks/useConstant';
import Taro from '@tarojs/taro';

export default function useStickyHeaderListener() {
  const [show, setShow] = useState(false);

  /** 手机屏幕上方到胶囊按钮底部的高度 */
  const top = useConstant(() => {
    const menuRect = Taro.getMenuButtonBoundingClientRect();
    return menuRect.bottom;
  });

  // 滚动监听函数
  function stickyHeaderListener(
    e: BaseEventOrig<ScrollViewProps.onScrollDetail>
  ) {
    if (show && e.detail.scrollTop < top) {
      setShow(false);
      return;
    }

    if (!show && e.detail.scrollTop > top) {
      setShow(true);
      return;
    }
  }

  return { show, stickyHeaderListener, top };
}
