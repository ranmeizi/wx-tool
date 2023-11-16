import { PromiseArea } from '@/components/PromiseArea';
import PullDownArea from '@/components/PullDownArea';
import { calc } from '@/components/VirtualList/calcHeight';
import { useCheckReachTop } from '@/components/VirtualList/useCheckReachTop';
import useQueryRect from '@/hooks/useQueryRect';
import { View } from '@tarojs/components';
import VirtualList from '@tarojs/components/virtual-list';
import React, { useEffect, useState } from 'react';
import RowItem, { SkeletonView } from './RowItem';

// 自己算一下高度 rpx
const ITEM_SIZE = calc(366);

// 假数据
function mock(pageNum = 1): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Array(100)
          .fill(1)
          .map((_, index) => ({
            id: index + (pageNum - 1) * 100,
            text: '虚拟列表好棒哦',
          }))
      );
    }, 1000);
  });
}

const Row = React.memo(({ id, index, data }: any) => {
  return (
    <View
      id={id}
      className={`list-item-${index}`}
      style={{ paddingTop: '24rpx' }}
    >
      <RowItem />
    </View>
  );
});

const ROOT_SELECTOR = '.virtual-list';

export default function ListView() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<Promise<any>>();
  const [showPullDownArea, setShowPullDownArea] = useState(false);

  const rect = useQueryRect(ROOT_SELECTOR);
  // 检测是否滚动到顶
  const [checkReachTop, cancelFn] = useCheckReachTop(ROOT_SELECTOR);

  useEffect(() => {
    refresh();
  }, []);

  async function getData(pageNum: number = page + 1) {
    setLoading(true);

    const list = (await mock()) || [];

    if (list.length === 0) {
      setLoading(false);
      throw '空数据';
    }

    if (pageNum === 1) {
      setData(list);
    } else {
      setData(data.concat(...list));
    }

    setPage(pageNum);
    setLoading(false);
  }

  function refresh() {
    const action = getData(1).catch(async (e) => {
      setShowPullDownArea(true);
      setData([]);
      return Promise.reject(e);
    });
    // 空数据刷新 promiseview
    data.length === 0 && setAction(action);
    return action;
  }
  return (
    <PullDownArea
      reachTop={showPullDownArea}
      className="full-height virtual-list"
      pullToRefreshFn={refresh}
    >
      <PromiseArea action={action} pendingView={<SkeletonView></SkeletonView>}>
        {rect?.height && (
          <VirtualList
            overscanCount={10}
            placeholderCount={10}
            height={rect?.height}
            upperThreshold={0}
            enhanced
            width="100%"
            item={Row}
            // @ts-ignore
            itemData={data}
            itemCount={data.length}
            itemSize={ITEM_SIZE}
            onScroll={({ scrollDirection, scrollOffset }) => {
              console.log('scroll', scrollDirection, scrollOffset);
              if (
                // 避免重复加载数据
                !loading &&
                // 只有往前滚动我们才触发
                scrollDirection === 'forward' &&
                // 5 = (列表高度 / 单项列表高度)
                // 100 = 滚动提前加载量，可根据样式情况调整
                scrollOffset > (data.length - 10) * ITEM_SIZE - rect?.height
              ) {
                getData();
              }

              if (!showPullDownArea && scrollOffset < 100) {
                checkReachTop(() => {
                  setShowPullDownArea(true);
                });
              }

              if (
                showPullDownArea &&
                scrollOffset > 0 &&
                scrollDirection === 'forward'
              ) {
                cancelFn.current && cancelFn.current();
                setShowPullDownArea(false);
              }
            }}
          />
        )}
      </PromiseArea>
    </PullDownArea>
  );
}
