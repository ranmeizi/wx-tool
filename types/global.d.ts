/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV:
      | 'weapp'
      | 'swan'
      | 'alipay'
      | 'h5'
      | 'rn'
      | 'tt'
      | 'quickapp'
      | 'qq'
      | 'jd';
  }
}

type LinkNode = {
  val: string;
  prev: LinkNode | null;
};

// 表单类型
interface FieldInputProps<T> {
  name: string;
  onBlur: (event?: any) => void;
  onChange: (event: any) => void;
  onFocus: (event?: any) => void;
  type?: string;
  value: T;
  checked?: boolean;
  multiple?: boolean;
  error?: any;
}
