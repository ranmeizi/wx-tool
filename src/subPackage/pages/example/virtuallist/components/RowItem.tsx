import Skeleton from '@/components/Skeleton';
import { View, Image, Text } from '@tarojs/components';
import './RowItem.less';

type Props = {};

const TEST_AVATAR =
  'https://img1.baidu.com/it/u=3378022341,1532006826&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889';

const TEST_COVER =
  'https://img1.baidu.com/it/u=3937666583,2950340960&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500';

export default function ({}: Props) {
  return (
    <View className="content-row">
      <View className="f-r j-between a-center">
        <Image className="avatar-image" src={TEST_AVATAR}></Image>
        <View className="quote">
          <Text className="quote__subject ole">大烟杆嘴里塞,我只抽第五代</Text>
          <Text className="quote__datetime">2021-09-29 23:22:03</Text>
        </View>
      </View>
      {/* divider */}
      <View className="divider"></View>
      <View className="f-r j-between full-width">
        <View className="f-c j-between" style={{ flex: 1 }}>
          <View className="title dle">我的联合国发言稿</View>
          <View className="desc">总字数:24432</View>
        </View>
        <Image src={TEST_COVER} className="cover-image-view"></Image>
      </View>
    </View>
  );
}

// 骨架 ⬇️
export function SkeletonView() {
  return (
    <View className="skeleton-view">
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <RowSkeleton key={index} />
        ))}
    </View>
  );
}

function RowSkeleton() {
  return (
    <View className="skeleton-view-item">
      <View className="f-r j-between">
        <Skeleton.Avatar></Skeleton.Avatar>
        <Skeleton className="quote"></Skeleton>
      </View>
      {/* divider */}
      <View className="divider"></View>
      <View className="f-r j-between full-width">
        <View className="f-c j-between" style={{ flex: 1 }}>
          <View>
            <Skeleton size="sm" style={{ marginBottom: '16rpx' }} />
            <Skeleton
              size="sm"
              style={{ width: '50%', marginBottom: '16rpx' }}
            />
          </View>
          <Skeleton size="sm" style={{ width: '35%' }} />
        </View>
        <Skeleton className="cover-image-view" />
      </View>
    </View>
  );
}
