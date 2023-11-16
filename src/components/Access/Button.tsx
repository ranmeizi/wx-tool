import React, { useContext } from 'react';
import { Button, ButtonProps } from '@tarojs/components';
import { context } from '@/contexts/AppPersist';
import usePhoneLogin from './usePhoneLogin';

export default function AccessButton({
  children,
  onClick,
  onTap,
  ...props
}: ButtonProps) {
  const { token } = useContext(context);

  const onGetPhoneNumber = usePhoneLogin(() => {
    onClick && onClick.call(null);
    onTap && onTap.call(null);
  });

  function isLogin() {
    return !!token;
  }

  const btnProps: ButtonProps = isLogin()
    ? {
        ...props,
        onClick,
        onTap,
      }
    : {
        ...props,
        openType: 'getPhoneNumber',
        onGetPhoneNumber: onGetPhoneNumber,
      };

  return <Button {...btnProps}>{children}</Button>;
}
