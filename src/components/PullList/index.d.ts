import React, { ReactNode } from "react";

export type BackTopOptions = {
  target?: HTMLElement;
  visibilityHeight?: number;
  onClick?: () => void;
};

type TypeRef = {
  current: any;
};

/**
 * 底部的元素
 * nomore 没有更多数据
 * loadmore 加载更多
 * loading 正在加载
 */
type FootStatus = "nomore" | "loadmore" | "loading";

/**
 * 顶部元素
 * enter 下拉的提示语
 * leave 下拉可以触发更新的提示语
 * fetching 刷新请求中的提示语
 * succeed 刷新成功的提示语
 */
export type HeadStatus = "enter" | "leave" | "fetching" | "succeed";

type StatusNodes<T extends string> = Partial<Record<T, React.ReactNode>>;

export interface Pagination {
  pageNum: number;
  pageSize: number;
  total?: number;
}

// 数据格式
export interface Data {
  list: any[];
  total: number;
}

type FnGetDataMethod = (pagination: Pagination) => Promise<Data>;

export type Props = {
  // 初始的pageNum 默认值为1
  defaultPageNum?: number;
  // 初始的pageSize 默认为20
  defaultPageSize?: number;
  // 供外部调用getData做主动查询用
  apiRef: TypeRef;
  // ！！！关键  外部需要给组件提供获取数据的接口
  getDataMethod: FnGetDataMethod;
  // 初始化需不需要请求数据 默认为false
  initGetDataOff?: boolean;
  // 唯一id
  rowKey: string;
  // 每行的模板
  renderRow: <T>(data: T, index: number) => React.ReactNode;
  listStyle?: React.CSSProperties;
  pullStyle?: React.CSSProperties;
  // 列表头部和底部的元素替换
  footer?: StatusNodes<FootStatus>;
  footerStyle?: React.CSSProperties;
  header?: StatusNodes<HeadStatus>;
  offsetBottom?: number;
  backTopOptions?: BackTopOptions & {
    node: ReactNode;
  };
  onScroll?: (movment: number) => void;
  emptyPage?: ReactNode;
  // 在翻页执行后的回调
  onAfterPagination?(
    pagination: {
      pageNum: number;
      pageSize: number;
      total: number;
    },
    list: any[]
  ): void;
};

export default class extends React.Component<Props, any> {
  getData(pageNum?: number, pageSize?: number): void;
  clearList(): void;
  getDataSource(): any[];
  render(): JSX.Element;
}
