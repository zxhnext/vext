import ApolloSSR from 'vue-apollo/ssr'
import createApp from './create-app'

export default context => { // 服务端renderer.renderToString(context)中传入的context
    return new Promise((resolve, reject) => {
        const {
            app,
            router,
            store,
            apolloProvider
        } = createApp({
            ssr: true,
        })

        if (context.user) { // 如果有用户名，加入用户名
            store.state.user = context.user
        }

        router.push(context.url) // 给路由推一条记录

        router.onReady(() => { // 路由异步操作完成后(如dom，获取数据操作)
            const matchedComponents = router.getMatchedComponents() // 根据url去匹配组件
            if (!matchedComponents.length) {
                return reject(new Error('no component matched'))
            }
            Promise.all(matchedComponents.map(Component => {
                if (Component.asyncData) { // 是否有asyncData方法
                    return Component.asyncData({ // 调用asyncData方法
                        route: router.currentRoute, // 匹配当前路由
                        router,
                        store
                    })
                }
            })).then(() => {
                // 同样注入 apollo 缓存状态
                context.apolloState = ApolloSSR.getStates(apolloProvider)
                context.meta = app.$meta()
                context.state = store.state
                context.router = router
                resolve(app)
            })
        })
    })
}
