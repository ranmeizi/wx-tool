import { Button, Text } from '@tarojs/components';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import { AccessButton } from '../Access';

type Props = {};

export type OpenOptions = {
  success?: () => any;
};

export type LoginModalRef = {
  open: (option: OpenOptions) => any;
};

const LoginModal = forwardRef<LoginModalRef>(function ({}: Props, ref) {
  const [open, setOpen] = useState(false);
  const successFn = useRef<() => any>();

  function openModal({ success }) {
    successFn.current = success;
    setOpen(true);
  }

  useImperativeHandle(ref, () => ({
    open: openModal,
  }));

  /** 拒绝 */
  function onCancel() {
    setOpen(false);
  }

  return (
    <AtModal className="tt-modal" isOpened={open} onClose={onCancel}>
      <AtModalHeader>提示</AtModalHeader>
      <AtModalContent>
        <Text>欢迎使用dudu小程序！登陆以获得最佳体验</Text>
      </AtModalContent>
      <AtModalAction>
        <Button className="tt-modal__cancel-btn" onClick={onCancel}>
          拒绝
        </Button>
        <AccessButton
          onClick={() => {
            successFn.current && successFn.current();
            setOpen(false);
          }}
          className="tt-modal__confirm-btn"
        >
          登陆
        </AccessButton>
      </AtModalAction>
    </AtModal>
  );
});

export default LoginModal;
