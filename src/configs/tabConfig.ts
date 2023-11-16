export interface TabBarItem {
    id: string // 自定义功能时，用于寻找tab的id
    pagePath: string; // 页面路由
    text: string; // tab文案
    iconPath: string; // 未选中时的icon
    selectedIconPath: string; // 选中时的icon
}

const tabConfig: TabBarItem[] = [
    {
        id: 'home',
        pagePath: "pages/home/index",
        text: "首页？",
        iconPath:
            "https://static.licaimofang.com/wp-content/uploads/2023/04/hold-2.png",
        selectedIconPath:
            "https://static.licaimofang.com/wp-content/uploads/2023/04/hold-selected-1.png",
    }, {
        id: 'mine',
        pagePath: "pages/mine/index",
        text: "我的？",
        iconPath:
            "https://static.licaimofang.com/wp-content/uploads/2023/04/user-1.png",
        selectedIconPath:
            "https://static.licaimofang.com/wp-content/uploads/2023/04/user-selected.png",
    },
]

export default tabConfig