/*
 * @Date: 2023-02-16 17:21:08
 * @LastEditors: boboan 360969885@qq.com
 * @LastEditTime: 2023-07-24 15:30:18
 * @FilePath: /assistant-ui/src/config/layoutSize.js
 * @Description: 页面布局高度
 */

import Taro from "@tarojs/taro";

export const systemInfo = Taro.getSystemInfoSync();
export const accountInfo = Taro.getAccountInfoSync();

/* tabbar 内容高度 */
export const tabbarInnerHeight = 67;
export const navbarInnerHeight = 44;

/* 底部安全高度，单位 px */
export const screenBottom =
  systemInfo.screenHeight - (systemInfo.safeArea?.bottom ?? 0);
/* 顶部安全高度，单位 px */
export const screenTop = systemInfo.safeArea?.top || systemInfo.statusBarHeight || 0;
/* tabbar高度，单位 px */
export const tabbarHeight = 67 + screenBottom;
/* navbar高度，单位 px */
export const navbarHeight = 44 + screenTop;
