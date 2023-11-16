import { View, ViewProps } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './style.less';

function Menu({ className, children, ...props }: ViewProps) {
  const _className = className ? `tt-menu ${className}` : 'tt-menu';
  return (
    <View {...props} className={_className}>
      {children}
    </View>
  );
}

type MenuItemProps = {
  showArrow?: boolean;
} & ViewProps;

function MenuItem({ children, showArrow, className, ...props }: MenuItemProps) {
  const _className = className ? `tt-menu-item ${className}` : 'tt-menu-item';
  return (
    <View {...props} className={_className}>
      <View className="full-width">{children}</View>

      {showArrow && (
        <AtIcon
          className="tt-menu__arrow-icon"
          value="chevron-right"
          size="12"
          color="#121d3a"
        />
      )}
    </View>
  );
}

Menu.Item = MenuItem;

export default Menu;
export { MenuItem };
