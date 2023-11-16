import { Button } from '@tarojs/components';
import React, { useImperativeHandle, useState, useRef } from 'react';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import './style.less';

export type InfoOption = {
  header: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  confirmText?: string;
  onConfirm?(): void;
};

type ConfirmOption = {
  header: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  confirmText?: string;
  onConfirm?(): void;
  cancelText?: string;
  onCancel?(): void;
};

export interface ModalRef {
  info: (option: InfoOption) => void;
  confirm: (option: ConfirmOption) => void;
  cancel: () => void;
}

/** 常用 Modal 封装 */
function Modal({}, ref: React.Ref<ModalRef> | undefined) {
  /** 弹窗类型 */
  const [type, setType] = useState<'info' | 'confirm'>('info');
  /** 打开状态 */
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<InfoOption | ConfirmOption | {}>({});

  /** 挂载api */
  useImperativeHandle(ref, () => ({
    info(option: InfoOption) {
      setType('info');
      setConfig(option);
      setOpen(true);
    },
    confirm(option: ConfirmOption) {
      setType('confirm');
      setConfig(option);
      setOpen(true);
    },
    cancel,
  }));

  function cancel() {
    setOpen(false);
  }

  return type === 'info'
    ? renderInfo(open, cancel, config as InfoOption)
    : renderConfirm(open, cancel, config as ConfirmOption);
}

function renderInfo(open: boolean, cancel, config: InfoOption) {
  return (
    <AtModal className={`tt-modal ${config?.className ?? ''}`} isOpened={open}>
      <AtModalHeader>{config.header}</AtModalHeader>
      <AtModalContent>{config.content}</AtModalContent>
      <AtModalAction>
        <Button
          className="tt-modal__confirm-btn"
          onClick={() => {
            config.onConfirm && config.onConfirm();
            cancel();
          }}
        >
          {config.confirmText || '确定'}
        </Button>
      </AtModalAction>
    </AtModal>
  );
}

function renderConfirm(open: boolean, cancel, config: ConfirmOption) {
  return (
    <AtModal className={`tt-modal ${config?.className ?? ''}`} isOpened={open}>
      <AtModalHeader>{config.header}</AtModalHeader>
      <AtModalContent>{config.content}</AtModalContent>
      <AtModalAction>
        <Button
          className="tt-modal__cancel-btn"
          onClick={() => {
            config.onCancel && config.onCancel();
            cancel();
          }}
        >
          {config.cancelText || '取消'}
        </Button>
        <Button
          className="tt-modal__confirm-btn"
          onClick={() => {
            config.onConfirm && config.onConfirm();
            cancel();
          }}
        >
          {config.confirmText || '确定'}
        </Button>
      </AtModalAction>
    </AtModal>
  );
}

export const WrapRefModal = React.forwardRef<ModalRef>(Modal);

export function useModal(): [React.RefObject<ModalRef>, React.ReactNode] {
  const ref = useRef<ModalRef>(null);
  const modal = <WrapRefModal ref={ref} />;

  return [ref, modal];
}

export { renderConmonModal } from './renderCommonModal';
