import { View, ViewProps } from '@tarojs/components';
import { useMemo } from 'react';
import './style.less';

type Props = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export default function Skeleton({
  size = 'md',
  className,
  ...props
}: ViewProps & Props) {
  const _class = useMemo(() => {
    return `skeleton-item${className ? ' ' + className : ''}${
      size ? ' ' + size : ''
    }`;
  }, [size, className]);

  return <View {...props} className={_class} />;
}

function Avatar(props: ViewProps & Props) {
  return <Skeleton {...props} className="skeleton-avatar" />;
}

Skeleton.Avatar = Avatar;
