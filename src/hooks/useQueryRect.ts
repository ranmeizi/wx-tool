import Taro, { getCurrentPages, NodesRef } from '@tarojs/taro';
import { useEffect, useState } from 'react';

export default function useQueryRect(selector) {
  const [rect, setRect] = useState<NodesRef.BoundingClientRectCallbackResult>();
  useEffect(() => {
    setTimeout(() => {
      const pageInstance = getCurrentPages()[getCurrentPages().length - 1];
      const query = Taro.createSelectorQuery().in(pageInstance);
      console.log('ss?', pageInstance);
      query.select(selector).boundingClientRect((rect: any) => {
        setRect(rect);
        console.log('useQueryRect', rect);
      });
      query.exec();
    }, 50);
  }, []);

  return rect;
}
