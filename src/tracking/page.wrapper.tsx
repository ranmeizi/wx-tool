import { throttle } from '@/utils/delay';
import { useDidHide, useDidShow, useLoad, useUnload } from '@tarojs/taro';
import TA from './index';
import * as PageHistory from './tool/LinkNode';

type ExpandProps = {
  page?: React.Ref<any>;
  pageId: string;
  extension?: Record<string, any>;
};

const wrapTrackingPage: HOC_Expand<ExpandProps> = (Component: any) => {
  return function ({ page, ...props }: any) {
    const pageId = props.pageId;
    const tabView = props.tabView;

    useLoad(() => {
      // 页面加载时
      if (tabView) {
        tabIn(pageId);
      } else {
        PageHistory.push(pageId);
      }
    });

    useUnload(() => {
      TA.duration.groups['pageStay'].end(props.extension);
      PageHistory.pop();
    });

    useDidHide(() => {
      TA.duration.groups['pageStay'].end(props.extension);
    });

    useDidShow(() => {
      console.log('page show');
      if (tabView) {
        tabIn(pageId);
      }

      TA.track({
        event: 'load',
        pageid: pageId,
      });

      TA.duration.groups['pageStay'].start({
        event: 'show',
        pageid: pageId,
      });
    });

    return <Component ref={page} {...props} />;
  };
};

const tabIn = throttle((pageId: string) => {
  if (PageHistory.Stack.curr) {
    PageHistory.replace(pageId);
  } else {
    PageHistory.push(pageId);
  }
}, 20);

(window as any).wx.getCurr = function () {
  console.log(PageHistory.Stack.curr);
};

export default wrapTrackingPage;
