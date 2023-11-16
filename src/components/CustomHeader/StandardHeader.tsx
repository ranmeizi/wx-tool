import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useMemo } from 'react';
import { AtIcon } from 'taro-ui';
import { MenuLayout } from './MenuLayout';
import './StandardHeader.less';

type Props = {
  // 标题
  title: string;
  style?: 'white' | 'black';
  left?: React.ReactNode;
};

export default function StandardHeader({
  title,
  left,
  style = 'black',
}: Props) {
  return (
    <View className={`standard-header ${style}`}>
      <MenuLayout
        menu={
          <View className="standard-header__menu-view">
            {/* 左边 */}
            <View className="menu-view__left">
              {left || <DefaultLeftBtn />}
            </View>
            {/* title */}
            <View className="menu-view__title">{title}</View>
          </View>
        }
      />
    </View>
  );
}

function isSinglePage() {
  return Taro.getCurrentPages().length === 1;
}

function DefaultLeftBtn() {
  const isSingle = useMemo(isSinglePage, []);

  function handleClick() {
    isSingle
      ? Taro.switchTab({
          url: '/pages/aigc/index',
        })
      : Taro.navigateBack();
  }

  return (
    <View className="left-default-btn" onClick={handleClick}>
      {/* 判断，单页小程序返回首页 */}
      {isSingle ? (
        <AtIcon value="home" size={20} />
      ) : (
        <AtIcon value="chevron-left" />
      )}
    </View>
  );
}
