import CustomTabbar from '@/components/CustomTabbar';
import Page from '@/components/Page';
import { View } from '@tarojs/components';
import React from 'react';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'mine';

definePageConfig({
  navigationBarTitleText: '页面名称',
});

export default function () {
  return (
    <Page pageId={PAGE_ID} tabView>
      <View>TabView</View>
      <CustomTabbar />
    </Page>
  );
}
