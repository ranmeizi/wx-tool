import { Component, PropsWithChildren } from 'react';
import 'taro-ui/dist/style/index.scss';
import './app.less';
import { Provider as TabProvider } from './components/CustomTabbar/context';
import { Provider as AppProvider } from './contexts/AppPersist';

class App extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return (
      <AppProvider>
        <TabProvider>{this.props.children}</TabProvider>
      </AppProvider>
    );
  }
}

export default App;
