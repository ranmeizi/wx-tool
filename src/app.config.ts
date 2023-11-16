export default defineAppConfig({
  pages: ['pages/home/index', 'pages/mine/index'],
  subPackages: [
    {
      root: 'subPackage',
      pages: [
        'pages/form-example/index',
        'pages/example/index', // 示例列表
        'pages/example/pulldown/index', // 下拉刷新 view
        'pages/example/pulldown/deep-refresher', // 下拉组件的深层隔代组件刷新
        'pages/example/virtuallist/with-pulldown', // 虚拟列表+pulldown
        'pages/example/virtuallist/with-pulldown-swiper', // 虚拟列表+pulldown+swiper
        'pages/example/customheader-menu-layout/index', // MenuLayout
        'pages/example/customheader-menu-layout/show-header', // 滚动显示头部
        'pages/example/modal/index', // 命令式弹窗
      ],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    custom: true,
    color: '#545968',
    selectedColor: '#0051CC',
    backgroundColor: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/tabbar-icons/buy-sell-signal.png',
        selectedIconPath: './assets/tabbar-icons/buy-sell-signal-select.png',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: './assets/tabbar-icons/personal.png',
        selectedIconPath: './assets/tabbar-icons/personal-select.png',
      },
    ],
  },
});
