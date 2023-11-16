import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { getCurrentPages } from "@tarojs/taro";
import React, { Component, createRef } from "react";
import { Props } from "./index.d";
import "./style.less";

const FOOTER_NODE = {
  nomore: "没有更多了",
  loadmore: "上拉加载更多",
  loading: "正在努力加载...",
};

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

export default class ListItem extends Component<Props, any> {
  state = {
    // 距离顶部距离
    top: 0,
    // 下拉?
    triggered: false,
    // 上拉?
    isPullUpLoad: false,
    // 列表数据
    dataSource: [],
    // 分页器
    pagination: {
      pageNum: this.props.defaultPageNum || 1,
      pageSize: this.props.defaultPageSize || 20,
      total: 0,
    },
    // 是否允许上拉刷新
    hasMoreData: true,
    // 展示空状态？
    isShowEmpty: false,
    // 展示回到顶部
    showBackTop: false,
    scrollIntoViewEl: undefined,
  };

  // pulllist元素
  el = createRef();

  ScrollViewCtx: Taro.ScrollViewContext | undefined;

  pageQuery: Taro.SelectorQuery | null = null;

  concat = createConcat(this.props.rowKey);

  get height() {
    return `calc(100vh - ${this.state.top}px)`;
  }

  // 顶部元素
  get header() {
    return this.props?.header || "下拉加载更多";
  }

  // 底部元素
  get footer() {
    const { isPullUpLoad, hasMoreData } = this.state;

    const status = isPullUpLoad
      ? "loading"
      : hasMoreData
      ? "loadmore"
      : "nomore";
    console.log("hasMoreData", hasMoreData, status);
    return this.props?.footer?.[status] || FOOTER_NODE[status];
  }

  get footerStyle() {
    return this.props.footerStyle || {};
  }

  get listStyle() {
    return this.props.listStyle || {};
  }

  get pullStyle() {
    return this.props.pullStyle || {};
  }

  get emptyPage() {
    return <View>{this.props.emptyPage}</View>;
  }

  get backTop() {
    const { showBackTop } = this.state;
    const { backTopOptions } = this.props;
    return backTopOptions ? (
      <View
        className={`rvt-backtop ${showBackTop ? "active" : ""}`}
        onClick={() => {
          // 滚动到头部
          this.ScrollViewCtx &&
            this.ScrollViewCtx.scrollTo({
              top: 0,
              duration: 300,
            });
          this.setState(
            {
              scrollIntoViewEl: "pl-top",
            },
            () => {
              setTimeout(() => {
                this.setState({
                  scrollIntoViewEl: undefined,
                });
              }, 300);
            }
          );
        }}
      >
        {this.props.backTopOptions?.node}
      </View>
    ) : null;
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    // 挂api
    this.props.apiRef &&
      (this.props.apiRef.current = {
        getData: this.getData,
        onResize: this.getTop,
        clearList: this.clearList,
        getDataSource: () => this.state.dataSource,
      });

    this.getTop();
    this.getScrollViewNode();

    if (!this.props.initGetDataOff) {
      await this.getData(1);
    }
  }

  // 获取元素距离顶部的高度 为了计算height
  getTop() {
    setTimeout(() => {
      const pageInstance = getCurrentPages()[getCurrentPages().length - 1];
      const query = Taro.createSelectorQuery().in(pageInstance);
      query.select(".pull-list").boundingClientRect(({ top }: any) => {
        this.setState({ top });
        if (!top) {
          this.getTop();
        }
      });
      query.exec();
    }, 50);
  }

  // 获取 scrollview context 以便控制滚动
  getScrollViewNode() {
    setTimeout(() => {
      const pageInstance = getCurrentPages()[getCurrentPages().length - 1];
      const query = Taro.createSelectorQuery().in(pageInstance);
      query
        .select(".pull-list")
        .node((res) => {
          this.ScrollViewCtx = res.node as Taro.ScrollViewContext;
        })
        .exec();
    }, 100);
  }

  // 清空数据
  clearList = () => {
    this.setState({ dataSource: [], hasMoreData: true });
  };

  // 获取数据
  getData = async (
    pageNum = this.state.pagination.pageNum + 1,
    pageSize = this.state.pagination.pageSize
  ) => {
    const { getDataMethod } = this.props;

    try {
      open();
      const { list, total } = await getDataMethod({ pageNum, pageSize });
      // 强行加1秒延迟
      await sleep(500);

      // pageNum===1 从0开始请求
      if (pageNum === 1) {
        // 滚动到头部
        this.ScrollViewCtx &&
          this.ScrollViewCtx.scrollTo({
            top: 0,
            duration: 300,
          });
        // 销毁
        this.concat = createConcat(this.props.rowKey);
        console.log(list);
        if (list.length == 0) {
          console.log("isShowEmpty");
          this.setState({
            isShowEmpty: true,
          });
          return;
        }

        this.setState({
          hasMoreData: list.length < total,
          isShowEmpty: false,
          dataSource: this.concat([], list),
          pagination: {
            total,
            pageNum,
            pageSize,
          },
        });

        return;
      }

      if (list.length > 0) {
        this.setState(
          {
            dataSource: this.concat(this.state.dataSource, list),
            isShowEmpty: false,
            pagination: {
              total,
              pageNum,
              pageSize,
            },
          },
          this.afterPagination
        );
      } else {
        this.setState({
          hasMoreData: false,
        });
      }
    } finally {
      close();
    }
  };

  // pagination更新后触发
  afterPagination() {
    const { onAfterPagination } = this.props;
    // 在翻页后
    onAfterPagination &&
      onAfterPagination(this.state.pagination, this.state.dataSource);
  }

  // scrollview 下拉刷新时触发
  onRefresh = async (e: any) => {
    this.setState({ triggered: true });
    await this.getData(1);
    this.setState({ triggered: false });
  };

  // 上拉加载
  pullUp = async () => {
    if (!this.state.hasMoreData) {
      return;
    }
    this.setState({
      isPullUpLoad: true,
    });
    await this.getData();
    this.setState({
      isPullUpLoad: false,
    });
  };

  // 滚动事件
  onScroll = (event: any) => {
    this.props.onScroll && this.props.onScroll(event.detail.deltaY);

    if (!this.props.backTopOptions) {
      return;
    }
    const { visibilityHeight = 450 } = this.props.backTopOptions;

    if (visibilityHeight - event.detail.scrollTop < 0) {
      !this.state.showBackTop && this.setState({ showBackTop: true });
    } else {
      this.state.showBackTop && this.setState({ showBackTop: false });
    }
  };

  render() {
    const { renderRow, rowKey } = this.props;
    const { triggered, dataSource, isShowEmpty, scrollIntoViewEl } = this.state;
    return (
      <View>
        <ScrollView
          className="pull-list"
          style={{ height: this.height, ...this.pullStyle }}
          scrollY
          enhanced
          showScrollbar={false}
          refresherEnabled
          refresherThreshold={50}
          refresherTriggered={triggered}
          refresherDefaultStyle="none"
          refresherBackground="transparent"
          onRefresherRefresh={this.onRefresh}
          onScrollToLower={this.pullUp}
          scrollIntoView={scrollIntoViewEl}
          scrollWithAnimation
          onScroll={this.onScroll}
        >
          <View style={{ ...this.listStyle }}>
            <View className="refresh-container">{this.header as any}</View>
            {isShowEmpty ? (
              this.emptyPage
            ) : (
              <>
                <View id="pl-top">
                  {dataSource.map((data, index) => (
                    <View key={data[rowKey] || index}>
                      {renderRow(data, index)}
                    </View>
                  ))}
                </View>
                <View className="pullup-tips" style={this.footerStyle}>
                  {this.footer}
                </View>
              </>
            )}
          </View>
        </ScrollView>
        {this.backTop}
      </View>
    );
  }
}

function createConcat(rowKey: string = "id") {
  console.log("concat", rowKey);
  const rowKeys: Record<string, boolean> = {};
  return function concat(oldList: any[], newList: any[]) {
    const filterList = newList.filter((item) => {
      const key: string = item[rowKey] + "";
      if (key in rowKeys) {
        return false;
      }
      rowKeys[key] = true;
      return true;
    });
    return oldList.concat(filterList);
  };
}

function open() {
  Taro.showLoading({
    mask: true,
    title: "努力加载中",
  });
}

function close() {
  Taro.hideLoading();
}

/**
 *
 * @param timeout 延迟timeout
 * @returns
 */
export async function sleep(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
