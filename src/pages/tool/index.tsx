import IMG_SQSD from '@/assets/images/sqsd.png';
import CustomTabbar from '@/components/CustomTabbar';
import Menu from '@/components/Menu';
import Page from '@/components/Page';
import { Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './style.less';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'tool';

const toolList = [
  {
    icon: IMG_SQSD,
    title: '捕捉宠物计算器',
    desc: '使用成长截图，计算对应成长捕捉概率',
    path: '/pages/sqsd-tool/normal-calc',
  },
];

definePageConfig({
  navigationBarTitleText: '工具',
});

export default function () {
  return (
    <Page pageId={PAGE_ID} className="tool-root">
      <View className="tool-view">
        <Menu>
          {toolList.map((item) => (
            <Menu.Item
              key={item.path}
              showArrow
              onClick={() =>
                Taro.navigateTo({
                  url: item.path,
                })
              }
            >
              <View className="f-r a-center">
                {item.icon && (
                  <Image className="menu-item__icon" src={item.icon} />
                )}
                <View className="f-c">
                  <View className="menu-item__title">{item.title}</View>
                  <View className="menu-item__desc">{item.desc}</View>
                </View>
              </View>
            </Menu.Item>
          ))}
        </Menu>
      </View>
      <CustomTabbar />
    </Page>
  );
}
