import Router from 'vue-router'

import routes from './routes'

export default () => {
    return new Router({
        routes,
        mode: 'history',
        // base: '/base/', // 默认根路由
        linkActiveClass: 'active-link', // 配置router-link激活时class名
        linkExactActiveClass: 'exact-active-link', // 配置router-link的class名,路由完全匹配时显示class名
        scrollBehavior(to, from, savedPosition) { // 滚动位置
            if (savedPosition) {
                return savedPosition
            } else {
                return {
                    x: 0,
                    y: 0
                }
            }
        }
        // fallback: true // 不支持history时自动切换为hash路由
        // parseQuery (query) { // 页面参数

        // },
        // stringifyQuery (obj) { // 参数转为字符串

        // }
    })
}
