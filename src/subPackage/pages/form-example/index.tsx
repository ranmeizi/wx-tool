import Page from '@/components/Page';
import { View } from '@tarojs/components';
import React from 'react';
import MyForm from './components/Form';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'form-example';

definePageConfig({
  navigationBarTitleText: '表单示例',
});

export default function () {
  return (
    <Page pageId={PAGE_ID}>
      <View>页面组件</View>
      <MyForm onSubmit={(d) => console.log(d)} />
    </Page>
  );
}
