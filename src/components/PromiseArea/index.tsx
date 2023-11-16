import React, { PropsWithChildren, useState, useEffect } from 'react';
import { AtIcon } from 'taro-ui';

enum EnumStatus {
  pending,
  fulfilled,
  rejected,
}

type PromiseAreaProps = {
  action?: Promise<any>;
  pendingView?: React.ReactNode;
  rejectedView?: React.ReactNode;
};

/** 默认 pending 画面 */
function DefaultPendingView() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <AtIcon value="loading" />
    </div>
  );
}

export function PromiseArea({
  children,
  action,
  pendingView = <DefaultPendingView />,
  rejectedView = null,
}: PropsWithChildren<PromiseAreaProps>) {
  const [status, setStatus] = useState<EnumStatus>(EnumStatus.pending);

  useEffect(() => {
    if (action) {
      action
        .then(() => {
          return EnumStatus.fulfilled;
        }) // 没有错误就显示
        .catch(() => {
          return EnumStatus.rejected;
        }) // 有错误就显示空页面
        .then(setStatus);
    }
  }, [action]);

  if (status === EnumStatus.pending) {
    return <>{pendingView}</>;
  }

  return <>{status === EnumStatus.fulfilled ? children : rejectedView!}</>;
}
