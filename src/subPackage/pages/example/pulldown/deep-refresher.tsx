import Menu from '@/components/Menu';
import Page from '@/components/Page';
import PullDownArea, { useRefresher } from '@/components/PullDownArea';
import { View, Image } from '@tarojs/components';
import React, { useState } from 'react';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'pulldown-deep-refresher';

definePageConfig({
  navigationBarTitleText: '一个需要下拉刷新的页面',
});

const IMG =
  'https://img2.baidu.com/it/u=1076638610,3430261181&fm=253&fmt=auto&app=138&f=JPEG?w=260&h=260';

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
        <View
          className="full-height full-width  f-c a-center"
          style={{ padding: '32rpx' }}
        >
          <Menu style={{ marginBottom: '24rpx' }}>
            <Menu.Item> coins:{count}</Menu.Item>
          </Menu>
          <Score></Score>
          <Image
            src={IMG}
            style={{ height: '400rpx', width: '400rpx', marginTop: '50rpx' }}
          ></Image>
        </View>
      </PullDownArea>
    </Page>
  );
}

function Score() {
  const [score, setScore] = useState(0);

  function getData(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(score + 100);
      }, 1000);
    });
  }

  async function refresh() {
    setScore(await getData());
  }

  // getdata 函数依赖于 score[deps]
  useRefresher(refresh, [score]);

  return (
    <Menu>
      <Menu.Item> scores:{score}</Menu.Item>
    </Menu>
  );
}
