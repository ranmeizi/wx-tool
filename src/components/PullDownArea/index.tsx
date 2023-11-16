import IMG_RELOAD from '@/assets/images/reload.png';
import EB, { EventBus } from '@/utils/EventBus';
import { throttle } from '@/utils/delay';
import { ITouchEvent, Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from 'react';
import { AtActivityIndicator } from 'taro-ui';
import './style.less';

const MAX_SLIDE_TOP = 120;
const RERENDER_INTERVAL = checkHighLevel() ? 30 : 80;
const TRANSITION = checkHighLevel() ? 60 : 90;
const FRAME_INTERVAL = 16;

function checkHighLevel() {
  const { benchmarkLevel } = Taro.getSystemInfoSync();

  // 未知默认高性能
  if (benchmarkLevel === -1) {
    return true;
  }

  return benchmarkLevel > 16;
}

const refreshEventContext = createContext<{ refreshEB?: EventBus }>({
  refreshEB: undefined,
});

/**
 * 用法
 *
 * 这个组件是一个遮罩层，当 scrolltop 到顶时候生效
 *
 * 下方最好不能下拉要不效果不好
 *
 * 下拉转动 SlideView
 *
 * 松手判断是否超过阈值，进入 loading 阶段
 *
 * 重写 SlideView / LoadingView
 *
 * provider 提供一个存有 eventbus 的事件对象
 *
 * 深层子组件可以通过订阅 refresh 事件，从而得到刷新回调
 */

/** 滑动状态 */
function SlideView({ style = {} }: any) {
  return (
    <Image
      style={{ height: '48rpx', width: '48rpx', ...style }}
      src={IMG_RELOAD}
    ></Image>
  );
}

/** Loading状态 */
function LoadingView() {
  return (
    <View style={{ transform: 'translate(-5rpx,-5rpx) scale(2)' }}>
      <AtActivityIndicator size={18} color="#707070"></AtActivityIndicator>
    </View>
  );
}

type Props = {
  /** 到顶？ */
  reachTop: boolean;
  className?: string;
  pullToRefreshFn: () => Promise<any>;
};

export default class PullDownArea extends React.Component<
  PropsWithChildren<Props>
> {
  timer: any = null;
  start = 0;

  eb = new EventBus();

  state = {
    state: 'pulling',
    slideTop: 0,
    progress: 0,
    scale: 1,
    touching: false,
  };

  get rootcls() {
    return this.props.className
      ? `tt-pulldown-area ${this.props.className}`
      : 'tt-pulldown-area';
  }

  clearTimer() {
    this.timer && clearTimeout(this.timer);
  }

  onTouchStart = (e: ITouchEvent) => {
    if (!this.props.reachTop) {
      return;
    }
    this.clearTimer();
    this.setState({ touching: true, state: 'pulling', scale: 1 });
    this.start = e.touches[0].pageY;
  };

  onTouchMove = throttle((e: ITouchEvent) => {
    if (!this.props.reachTop) {
      return;
    }
    if (!this.state.touching) {
      return;
    }

    const { pageY } = e.touches[0];

    let y = pageY - this.start;

    const slideTop = y > MAX_SLIDE_TOP ? MAX_SLIDE_TOP : y;

    this.setState({
      slideTop: slideTop,
      progress: slideTop / MAX_SLIDE_TOP,
    });
  }, RERENDER_INTERVAL);

  onTouchEnd = () => {
    if (!this.props.reachTop) {
      return;
    }
    this.setState({ touching: false });
    this.start = 0;

    if (this.state.slideTop > MAX_SLIDE_TOP / 2) {
      this.toRefreshAnimation();
      this.setState({ state: 'loading' });
      Promise.all([
        this.props.pullToRefreshFn(),
        this.eb.promiseAllEmit('refresh', {}),
      ]).finally(() => {
        this.succAnimation();
      });
    } else {
      this.slideCancelAnimation();
    }
  };

  // 取消滑动
  slideCancelAnimation = () => {
    this.state.slideTop !== 0 &&
      this.setState({
        slideTop: 0,
      });
  };

  // loading
  toRefreshAnimation() {
    const step = (MAX_SLIDE_TOP * 4) / 5 / (100 / FRAME_INTERVAL);
    const animate = () => {
      if (this.state.slideTop > (MAX_SLIDE_TOP * 4) / 5) {
        this.timer = setTimeout(() => {
          this.setState({
            slideTop: this.state.slideTop - step,
          });
          animate();
        }, FRAME_INTERVAL);
      } else {
        this.timer = null;
      }
    };
    animate();
  }

  succAnimation() {
    // 0.15s 消失
    const step = 1 / (150 / FRAME_INTERVAL / 1.5);
    const animate = () => {
      if (this.state.scale > 0) {
        this.timer = setTimeout(() => {
          this.setState({
            scale: this.state.scale - step,
          });
          animate();
        }, FRAME_INTERVAL);
      } else {
        this.setState({ slideTop: 0 });
        this.timer = null;
      }
    };
    animate();
  }

  componentDidMount(): void {
    EB.on('PullDownList无条件消失', this.slideCancelAnimation);
  }

  componentWillUnmount(): void {
    EB.un('PullDownList无条件消失', this.slideCancelAnimation);
  }

  render() {
    const { onTouchStart, onTouchMove, onTouchEnd, rootcls } = this;
    const { slideTop, progress, state } = this.state;
    const { children } = this.props;
    return (
      <View
        className={rootcls}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <View
          className="tt-pulldown-area__slider"
          style={{
            transform: `translateY(${slideTop}px) scale(${this.state.scale})`,
            transition: `transform ${TRANSITION}ms`,
          }}
        >
          <View
            className="tt-pulldown-area__icon"
            style={{
              boxShadow:
                slideTop > 0
                  ? '2rpx 2rpx 6rpx 1rpx rgba(0, 0, 0, 0.2)'
                  : 'none',
            }}
          >
            {state === 'loading' ? (
              <LoadingView />
            ) : (
              <SlideView
                style={{
                  transform: `rotateZ(${progress * 2 * 360 + 135}deg)`,
                  transition: `transform ${TRANSITION}ms`,
                }}
              />
            )}
          </View>
        </View>
        <refreshEventContext.Provider value={{ refreshEB: this.eb }}>
          {children}
        </refreshEventContext.Provider>
      </View>
    );
  }
}

/** 刷新 hook */
export const useRefresher = function (
  callback: () => Promise<any>,
  deps: any[]
) {
  const { refreshEB } = useContext(refreshEventContext);
  useEffect(() => {
    refreshEB?.on('refresh', callback);
    return () => {
      refreshEB?.un('refresh', callback);
    };
  }, deps);
};

/** 减少setState次数 */
export const cancelAll = throttle(() => {
  EB.emit('PullDownList无条件消失', {});
}, 300);
