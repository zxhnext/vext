module.exports = {
    // 客户端dev端口号
    devClientPort: 8000,
    // 客户端地址
    host: '0.0.0.0',
    // cdn地址
    cdnUrl: 'http://127.0.0.1:8000/',
    // 开发环境客户端域名
    devClientUrl: 'http://127.0.0.1:8000',
    // 生产环境客户端域名
    prodClientUrl: 'http://127.0.0.1:8000',
    // sourceMap配置
    sourceMap: {
        development: 'cheap-module-eval-source-map',
        production: 'cheap-module-source-map'
    },
    isPWA: false,
    // 预渲染路由配置
    prerenderRoutes: ['/prerender', '/prerender2'],
    // 骨架屏配置
    skeletonRoutes: [{
        path: '/', //对应使用路由
        skeletonId: 'Skeleton-question' // 所用骨架屏的id标识
    }, {
        path: '/my', //对应使用路由
        skeletonId: 'Skeleton-my' // 所用骨架屏的id标识
    }],
}
