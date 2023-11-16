# 多种类埋点统一接口

统一了埋点的api

各家在 impls 中实现埋点

使用 agent 统一调用

## page.wrapper

- 包装 Page 组件 让page 在 show hide 时 发送 show / stay 埋点
- 使用 LinkNode 维护页面的访问顺序

## duretion

实现 停留时长的自动计算

tracking 和 linknode 会有些耦合，不过就这么用吧，不再改了

## data 组成部分

tracking 有3个数据部分，会在埋点时组合成 data 发送

>**globalData**
    通过 Agent.setGlobal 设置的全局数据，通常在收集完global数据时设置1次

>**acount**
    通过 Agent.setAccount 设置的用户标识，在用户登陆状态发生改变时设置
    例如：
    userid：100000001,
    uname:'张三'

>**page**
    通过 page.wrapper 组件收集的页面访问数据
    pageId:'home', // 当前触发事件的页面
    ref:'mine'     // 上个页面的pageid
>
