import IMG_TOOL from '@/assets/tabbar-icons/tool.png';
import IMG_TOOL_SELECT from '@/assets/tabbar-icons/tool-select.png';
import IMG_ABOUT from '@/assets/tabbar-icons/about.png';
import IMG_ABOUT_SELECT from '@/assets/tabbar-icons/about-select.png';

export interface TabBarItem {
  id: string; // 自定义功能时，用于寻找tab的id
  pagePath: string; // 页面路由
  text: string; // tab文案
  iconPath: string; // 未选中时的icon
  selectedIconPath: string; // 选中时的icon
}

const tabConfig: TabBarItem[] = [
  {
    id: 'tool',
    pagePath: 'pages/tool/index',
    text: '工具',
    iconPath: IMG_TOOL,
    selectedIconPath: IMG_TOOL_SELECT,
  },
  {
    id: 'about',
    pagePath: 'pages/about/index',
    text: '关于',
    iconPath: IMG_ABOUT,
    selectedIconPath: IMG_ABOUT_SELECT,
  },
];

export default tabConfig;
