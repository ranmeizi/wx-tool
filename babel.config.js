// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }]
  ],
  // 目前不需要按需引入，等到taroui再更新一下。。。
  // plugins: [
  //   ["import", {
  //     libraryName: "taro-ui",
  //     // libraryDirectory: "lib/components",
  //     // styleLibraryDirectory: "dist/style/components",
  //     customName: (name, file) => {
  //       console.log('name',name)
  //       const nameSection = name.split('-')
  //       if (nameSection.length === 4) {
  //         // 子组件的路径跟主组件一样
  //         nameSection.pop()
  //       }
  //       const path = nameSection.slice(1).join('-');
  //       return `taro-ui/lib/components/${path}`;
  //     },
  //     style: (name) => {
  //       // name 是 customName 的 return
  //       const wholePath = name.split('/')
  //       const compName = wholePath[wholePath.length - 1]
  //       // XXX: 如果报错，就在这里映射
  //       console.log('style',compName)
  //       const fix = {
  //         'tabs-pane': 'tabs',
  //         "list-item": "list"
  //       }[compName]
  //       return `taro-ui/dist/style/components/${fix || compName}.scss`
  //     }
  //   }]
  // ]
}
