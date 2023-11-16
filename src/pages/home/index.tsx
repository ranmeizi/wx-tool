import HomeHeader from '@/components/CustomHeader/StandardHeader';
import CustomTabbar from '@/components/CustomTabbar';
import Page from '@/components/Page';
import { ScrollView, View, Button } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import { AtAccordion, AtInput, AtList, AtListItem } from 'taro-ui';
import './style.less';

const PAGE_ID = 'home';

definePageConfig({
  navigationBarTitleText: 'taro-template',
});

export default function () {
  function navToFormExample() {
    Taro.navigateTo({
      url: '/subPackage/pages/form-example/index',
    });
  }

  return (
    <Page pageId={PAGE_ID} tabView>
      <ScrollView className="full-height" scrollY>
        <View>首页</View>
        <View>这里很干净，去example页看看吧</View>
        <Button
          onClick={() =>
            Taro.navigateTo({ url: '/subPackage/pages/example/index' })
          }
        >
          Example
        </Button>
      </ScrollView>
      <CustomTabbar />
    </Page>
  );
}
