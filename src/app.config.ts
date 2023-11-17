export default defineAppConfig({
  pages: [
    'pages/tool/index',
    'pages/about/index',
    'pages/sqsd-tool/normal-calc',
  ],
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
        pagePath: 'pages/tool/index',
        text: '工具',
        iconPath: './assets/tabbar-icons/tool.png',
        selectedIconPath: './assets/tabbar-icons/tool-select.png',
      },
      {
        pagePath: 'pages/about/index',
        text: '关于',
        iconPath: './assets/tabbar-icons/about.png',
        selectedIconPath: './assets/tabbar-icons/about-select.png',
      },
    ],
  },
});
