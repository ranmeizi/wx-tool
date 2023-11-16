import { debounceCancelAble } from '@/utils/delay';
import Taro from '@tarojs/taro';
import { useRef, useEffect, useMemo } from 'react';

/**
 * onscroll 判断并不准确
 * 所以在 scroll offset 小于 xxx 时
 * 执行这段修复代码
 * 判断第一位是否在 scrolltop 0 的位置
 */
export function useCheckReachTop(rootSelector: string) {
  const top = useRef(0);
  const cancelFix = useRef(() => {});

  function init() {
    const pageInstance =
      Taro.getCurrentPages()[Taro.getCurrentPages().length - 1];
    const query = Taro.createSelectorQuery().in(pageInstance);
    query.select(rootSelector).boundingClientRect((rect: any) => {
      top.current = rect.top;
    });
    query.exec();
  }

  useEffect(() => {
    setTimeout(init, 50);
    setTimeout(init, 250);
    setTimeout(init, 1000);
  }, []);

  // 检测
  function check() {
    return new Promise((resolve) => {
      const pageInstance =
        Taro.getCurrentPages()[Taro.getCurrentPages().length - 1];
      const query = Taro.createSelectorQuery().in(pageInstance);
      query
        .select(`${rootSelector} .list-item-0`)
        .boundingClientRect((rect: any) => {
          const res = averageLessThan(rect.top, top.current);
          resolve(res);
        });
      query.exec();
    });
  }

  // 缓存一下 debouce 函数
  const debounceCheck = useMemo(() => {
    const fn = debounceCancelAble((callback) => {
      const p = check();
      if (p) {
        p.then((isReachTop) => {
          isReachTop && callback();
        });
      }
    }, 150);
    return (...attr) => {
      cancelFix.current = fn.apply(null, attr);
    };
  }, [top]);

  return [debounceCheck, cancelFix] as [typeof debounceCheck, typeof cancelFix];
}

function averageLessThan(x1: number, x2: number) {
  return Math.abs(x1 - x2) < 5;
}
