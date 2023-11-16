// TODO
import { BaseEventOrig, ScrollViewProps, View } from '@tarojs/components';
import Taro, { ScrollViewContext } from '@tarojs/taro';
import { useEffect, useRef, useState } from 'react';
import './style.less';

const SCROLL_TOP = 600;

export function useBacktop(selector: string) {
  const scrollViewContext = useRef<ScrollViewContext>();
  const [showBackTop, setShowBackTop] = useState(false);
  useEffect(() => {
    Taro.createSelectorQuery()
      .select(selector)
      .node()
      .exec((res) => {
        const scrollView = res[0]?.node;
        scrollViewContext.current = scrollView;
      });
  }, []);

  function handleBackTop() {
    scrollViewContext.current?.scrollTo({
      top: 0,
      duration: 300,
      animated: true,
    });
  }

  const backtop = (
    <View
      className={`tt-backtop ${showBackTop ? 'active' : ''}`}
      onClick={handleBackTop}
    >
      <View>
        <View>回到</View>
        <View>顶部</View>
      </View>
    </View>
  );

  function backtopListener(e: BaseEventOrig<ScrollViewProps.onScrollDetail>) {
    if (SCROLL_TOP - e.detail.scrollTop < 0) {
      !showBackTop && setShowBackTop(true);
    } else {
      showBackTop && setShowBackTop(false);
    }
  }

  return {
    backtop,
    backtopListener,
  };
}
