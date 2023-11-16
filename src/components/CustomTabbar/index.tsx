import { CoverImage, CoverView, Image, View } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useContext, useEffect, useMemo } from 'react';
import { context } from './context';
import './style.less';
import SafeArea from '../SafeArea';

// tabbar 文字颜色
const selectedColor = '#D3B07A';
const color = '#999999';

type CustomTabbarProps = {
  coverView?: boolean;
};

export default function ({ coverView }: CustomTabbarProps) {
  const { tabs, current, setCurrent } = useContext(context);

  const { path } = useRouter();

  function switchTab(index) {
    const pagePath = tabs[index].pagePath;
    setCurrent(index);
    Taro.switchTab({
      url: '/' + pagePath,
    });
  }

  useDidShow(checkTab);

  function checkTab() {
    const index = tabs.findIndex((item) => item.pagePath === path.slice(1));
    if (index >= 0) {
      setCurrent(index);
    }
  }

  const ViewComp = useMemo(() => {
    return coverView ? CoverView : View;
  }, [coverView]);

  const ImageComp = useMemo(() => {
    return coverView ? CoverImage : Image;
  }, [coverView]);

  return (
    <ViewComp className="custom-tabbar">
      <ViewComp className="f-r">
        {tabs.map((item, index) => {
          return (
            <ViewComp
              className="custom-tabbar-item"
              onClick={() => {
                switchTab(index);
              }}
              data-path={item.pagePath}
              key={item.text}
            >
              <ViewComp className="tabbar-img-view">
                {current === index ? (
                  <ImageComp
                    className="tabbar-img"
                    src={item.selectedIconPath}
                  />
                ) : (
                  <ImageComp className="tabbar-img" src={item.iconPath} />
                )}
              </ViewComp>

              <ViewComp
                className="tabbar-text"
                style={{ color: current === index ? selectedColor : color }}
              >
                {item.text}
              </ViewComp>
            </ViewComp>
          );
        })}
      </ViewComp>
      <SafeArea position="bottom" />
    </ViewComp>
  );
}
