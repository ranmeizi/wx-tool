import { context } from '@/contexts/AppPersist';
import { View, ViewProps } from '@tarojs/components';
import { PropsWithChildren, useContext, useMemo } from 'react';
import AccessButton from './Button';

export default function AccessCoverArea({
  children,
  onClick,
  onTap,
  ...viewProps
}: PropsWithChildren<ViewProps>) {
  const className = useMemo(() => {
    return viewProps.className
      ? `access-cover-area ${viewProps.className}`
      : 'access-cover-area';
  }, [viewProps.className]);

  const { token } = useContext(context);

  function isLogin() {
    return !!token;
  }

  const props: ViewProps = isLogin()
    ? {
        ...viewProps,
        onClick,
        onTap,
      }
    : {
        ...viewProps,
      };

  return (
    <View {...props} className={className}>
      {!isLogin() && (
        <AccessButton
          className="access-cover-area__login-btn"
          onClick={onClick}
          onTap={onTap}
        />
      )}

      {children}
    </View>
  );
}
