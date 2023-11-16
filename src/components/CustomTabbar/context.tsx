import {
  PropsWithChildren,
  Component,
  PureComponent,
  ReactNode,
  createContext,
} from 'react';
import tabConfig, { TabBarItem } from '@/configs/tabConfig';

export interface ITabContext {
  tabs: TabBarItem[];
  current: number;
  setCurrent(v: number): void;
}

export const context = createContext<ITabContext>({
  tabs: tabConfig,
  current: 0,
  setCurrent: (v: number) => {},
});

export class Provider extends PureComponent<PropsWithChildren> {
  state = {
    tabs: tabConfig,
    current: 0,
  };

  setCurrent(current: number) {
    console.log('setCurrent', current);
    this.setState({ current });
  }

  render(): ReactNode {
    const { tabs, current } = this.state;
    const { children } = this.props;
    return (
      <context.Provider
        value={{
          tabs: tabs,
          current: current,
          setCurrent: this.setCurrent.bind(this),
        }}
      >
        {children}
      </context.Provider>
    );
  }
}
