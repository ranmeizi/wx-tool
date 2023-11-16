import { MenuLayout } from '@/components/CustomHeader/MenuLayout';
import StandardHeader from '@/components/CustomHeader/StandardHeader';
import useStickyHeaderListener from '@/components/CustomHeader/useStickyHeaderListener';
import Page from '@/components/Page';
import { ScrollView, View } from '@tarojs/components';
import './show-header.less';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'show-hea';

definePageConfig({
  navigationStyle: 'custom',
});

export default function () {
  /** 吸顶头部 */
  const { show, stickyHeaderListener, top } = useStickyHeaderListener();
  return (
    <Page
      pageId={PAGE_ID}
      className="show-header"
      style={{ background: '#f0f1f4' }}
    >
      <ScrollView
        className="full-height"
        scrollY
        onScroll={stickyHeaderListener}
      >
        <View style={{ height: '5000px' }}>
          {show && <StandardHeader title="我来了" />}
          <MenuLayout />
          <View style={{ marginBottom: top + 'px' }}>往下滑</View>
          <View>差不多了</View>
        </View>
      </ScrollView>
    </Page>
  );
}
