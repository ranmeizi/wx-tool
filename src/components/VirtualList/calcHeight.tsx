import Taro from '@tarojs/taro';

const width = Taro.getSystemInfoSync().screenWidth;

export function calc(num) {
  return (width / 750) * num;
}
