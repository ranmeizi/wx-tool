import { View, Image } from '@tarojs/components';
import { InfoOption } from './index';

type Options = {
  icon?: string;
  title: string;
  desc?: string[];
  img?: string;
};

export function renderConmonModal({
  icon,
  title,
  desc = [],
  img,
}: Options): Pick<InfoOption, 'header' | 'content'> {
  return {
    header: (
      <View className="common-modal__header f-c j-center a-center">
        {icon ? <Image className="common-modal__icon" src={icon} /> : null}
        <View className="common-modal__title">{title}</View>
      </View>
    ),
    content: (
      <View className="common-modal__content f-c j-center a-center">
        {desc.map((txt) => (
          <View key={txt} className="common-modal__descline">
            {txt}
          </View>
        ))}
        {img ? (
          <Image mode="widthFix" className="common-modal__img" src={img} />
        ) : null}
      </View>
    ),
  };
}
