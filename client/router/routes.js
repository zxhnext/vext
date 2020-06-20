import Questions from '../views/questions/index.vue'
// import Login from '../views/login/login.vue'

export default [{
        // path: '/app/:id', // /app/xxx
        path: '/',
        props: true, // 开启后会在组件内直接获取到id
        // props: (route) => ({ id: route.query.b }),
        component: Questions,
        name: '首页',
        meta: {
            title: '知乎',
            description: '知乎首页',
            isSSR: true,
        },
        beforeEnter(to, from, next) { // 进入路由前
            console.log('app route before enter')
            next()
        }
        // children: [
        //   {
        //     path: 'test',
        //     component: Login
        //   }
        // ]
    },
    {
        path: '/my',
        meta: {
            title: '我的',
            description: '我的',
            isSSR: false,
        },
        component: () => import( /* webpackChunkName: "my-view" */ '../views/my/index.vue')
        // component: Login
    },
    {
        path: '/prerender',
        meta: {
            title: '预渲染',
            description: '预渲染',
            isSSR: false,
        },
        component: () => import( /* webpackChunkName: "prerender1-view" */ '../views/prerender/index.vue')
    },
    {
        path: '/prerender2',
        meta: {
            title: '预渲染',
            description: '预渲染',
            isSSR: false,
        },
        component: () => import( /* webpackChunkName: "prerender2-view" */ '../views/prerender/index2.vue')
    }
]
