import Menu from '@/components/Menu';
import Page from '@/components/Page';
import PullDownArea from '@/components/PullDownArea';
import { View } from '@tarojs/components';
import React, { useState } from 'react';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'pulldown-index';

definePageConfig({
  navigationBarTitleText: '一个需要下拉刷新的页面',
});

export default function () {
  const [count, setCount] = useState(0);

  function getData(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(count + 1);
      }, 1000);
    });
  }

  async function refresh() {
    setCount(await getData());
  }

  return (
    <Page pageId={PAGE_ID} style={{ background: '#f0f1f4' }}>
      <PullDownArea
        className="full-width full-height"
        reachTop
        pullToRefreshFn={refresh}
      >
        <View className="full-height full-width" style={{ padding: '32rpx' }}>
          <Menu>
            <Menu.Item> count:{count}</Menu.Item>
          </Menu>
        </View>
      </PullDownArea>
    </Page>
  );
}
