import { MenuLayout } from '@/components/CustomHeader/MenuLayout';
import Page from '@/components/Page';
import { View, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React from 'react';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'custom-header-menu-layout';

definePageConfig({
  navigationStyle: 'custom',
});

export default function () {
  return (
    <Page pageId={PAGE_ID} style={{ background: '#f0f1f4' }}>
      <MenuLayout debug status="电池栏" menu="不带胶囊的header"></MenuLayout>
      <View style={{ padding: '32rpx' }}>
        <View>{'先设置' + "navigationStyle: 'custom'"}</View>
        <View>
          MenuLayout 是使用自定义头部时占位用的组件，他会计算每个部分的高度
        </View>
        <View>这里使用颜色来展示 MenuLayout组件的3个部分</View>

        <Button onClick={() => Taro.navigateBack()}> 返回</Button>
      </View>
    </Page>
  );
}
