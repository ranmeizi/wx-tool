import Menu from '@/components/Menu';
import Page from '@/components/Page';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './style.less';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'example';

const examples = [
  {
    title: 'MenuLayout',
    desc: '自定义头部时，使用 MenuLayout 占位',
    path: '/subPackage/pages/example/customheader-menu-layout/index',
  },
  {
    title: '滚动显示头部',
    desc: '监听滚动一定高度时，显示头部',
    path: '/subPackage/pages/example/customheader-menu-layout/show-header',
  },
  {
    title: 'useModal',
    desc: '命令式弹窗',
    path: '/subPackage/pages/example/modal/index',
  },
  {
    title: '下拉刷新',
    desc: '一个监听 move down 的 container',
    path: '/subPackage/pages/example/pulldown/index',
  },
  {
    title: '下拉刷新-深层刷新',
    desc: 'context + eventbus 实现的 useRefresher',
    path: '/subPackage/pages/example/pulldown/deep-refresher',
  },
  {
    title: '虚拟列表+下拉刷新',
    desc: '虚拟列表+下拉刷新',
    path: '/subPackage/pages/example/virtuallist/with-pulldown',
  },
  {
    title: '虚拟列表+下拉刷新+swiper',
    desc: '虚拟列表+下拉刷新+swiper 顺便再加个骨架吧',
    path: '/subPackage/pages/example/virtuallist/with-pulldown-swiper',
  },
];

definePageConfig({
  navigationBarTitleText: 'Example',
});

export default function () {
  return (
    <Page pageId={PAGE_ID} className="example-root">
      <View>
        <Menu>
          {examples.map((item) => (
            <Menu.Item
              key={item.path}
              showArrow
              onClick={() =>
                Taro.navigateTo({
                  url: item.path,
                })
              }
            >
              <View className="f-c">
                <View className="menu-item__title">{item.title}</View>
                <View className="menu-item__desc">{item.desc}</View>
              </View>
            </Menu.Item>
          ))}
        </Menu>
      </View>
    </Page>
  );
}
