import useConstant from '@/hooks/useConstant';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';

type SafeAreaProps = {
  position: 'bottom' | 'top';
};

function SafeArea(props: SafeAreaProps) {
  const { bottom, top } = useConstant(() => {
    const { safeArea, screenHeight } = Taro.getSystemInfoSync();
    return {
      top: safeArea!.top,
      bottom: screenHeight - safeArea!.bottom,
    };
  });
  return (
    <View
      style={{
        height: props.position === 'bottom' ? bottom + 'px' : top + 'px',
      }}
    />
  );
}

export default SafeArea;
