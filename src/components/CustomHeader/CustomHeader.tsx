import useConstant from '@/hooks/useConstant';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React from 'react';
import { MenuLayout } from './MenuLayout';

type Props = {
  custom?: React.ReactNode;
};

export default function CustomHeader({ custom }: Props) {
  return (
    <View
      id="custom-header"
      className="f-c custom-header"
      style={{
        width: '100%',
        position: 'fixed',
        top: 0,
      }}
    >
      <MenuLayout
        // debug
        menu={
          <View className="f-r j-center a-center full-height">{custom}</View>
        }
      />
    </View>
  );
}
