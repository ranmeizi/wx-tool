import Page from '@/components/Page';
import { cancelAll } from '@/components/PullDownArea';
import { Swiper, SwiperItem, View } from '@tarojs/components';
import { useState } from 'react';
import { AtTabs } from 'taro-ui';
import './style.less';
import ListView from './components/ListView';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'virtuallist-with-pulldown-swiper';

const tabList = [
  { title: '推荐文章' },
  { title: '我的锐刻' },
  { title: '我的小马' },
];

definePageConfig({
  navigationBarTitleText: 'swiper切换的下拉刷新虚拟列表',
});

export default function () {
  // tab index
  const [current, setCurrent] = useState(0);
  return (
    <Page pageId={PAGE_ID} style={{ background: '#f0f1f4' }}>
      <View className="full-height f-c" catchMove>
        <AtTabs
          className="list__tab"
          current={current}
          tabList={tabList}
          onClick={(i) => {
            setCurrent(i);
          }}
        />
        <Swiper
          style={{ flex: 1 }}
          current={current}
          onChange={(e) => setCurrent(e.detail.current)}
          onTransition={() => cancelAll()}
        >
          {/* 默认展示 推荐列表 */}
          <SwiperItem>
            <ListView />
          </SwiperItem>

          {/* 我的创作 */}
          <SwiperItem>
            <ListView />
          </SwiperItem>
          {/* 浏览记录 */}
          <SwiperItem>
            <ListView />
          </SwiperItem>
        </Swiper>
      </View>
    </Page>
  );
}
