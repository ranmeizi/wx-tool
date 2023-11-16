import { useModal } from '@/components/Modal';
import Page from '@/components/Page';
import { View, Button } from '@tarojs/components';
import React from 'react';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'useModal';

definePageConfig({
  navigationBarTitleText: '页面名称',
});

export default function () {
  const [modalCtrl, modal] = useModal();

  function openModal() {
    modalCtrl.current?.confirm({
      header: '命令式弹窗',
      content: '使用useModal',
    });
  }

  return (
    <Page pageId={PAGE_ID}>
      <View>
        {modal}

        <Button onClick={openModal}>点我弹窗</Button>
      </View>
    </Page>
  );
}
