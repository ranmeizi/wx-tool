import Page from '@/components/Page';
import ListView from './components/ListView';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'virtuallist-with-pulldown';

definePageConfig({
  navigationBarTitleText: '下拉刷新的虚拟列表',
});

export default function () {
  return (
    <Page pageId={PAGE_ID} style={{ background: '#f0f1f4' }}>
      <ListView />
    </Page>
  );
}
