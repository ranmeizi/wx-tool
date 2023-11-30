import CustomTabbar from '@/components/CustomTabbar';
import Page from '@/components/Page';
import { Button, View } from '@tarojs/components';
import './style.less';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'about';

definePageConfig({
  navigationBarTitleText: '关于',
});

export default function () {
  return (
    <Page pageId={PAGE_ID} tabView>
      <View className="about-root">
        <View>hi,我是波波安</View>
        <View>这是一个个人小程序，用来存放一些工具发布给大家用</View>
        <View>
          如果您有什么建议，请点击
          <Button className="feedback-btn" openType="feedback">
            意见反馈
          </Button>
          为我留言
        </View>
      </View>
      <CustomTabbar />
    </Page>
  );
}
