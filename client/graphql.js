import Vue from "vue";
import {
    ApolloClient
} from "apollo-client";
import {
    HttpLink
} from "apollo-link-http";
import fetch from 'node-fetch';
import {
    InMemoryCache
} from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";

// 安装 vue 插件
Vue.use(VueApollo);

export function createApolloClient(ssr = false) {
    const httpLink = new HttpLink({
        // config.js 代理设置
        // '/graphql': {
        //     target: "http://localhost:4000/graphql",
        //     changeOrigin: true,
        //     pathRewrite: {
        //         '^/graphql': '/graphql'
        //     }
        // },
        // 你需要在这里使用绝对路径
        uri: "http://localhost:4000/graphql",
        fetch: fetch
    });

    const cache = new InMemoryCache();

    // 如果在客户端则恢复注入状态
    if (!ssr) {
        if (typeof window !== "undefined") {
            const state = window.__APOLLO_STATE__;
            if (state) {
                // 如果你有多个客户端，使用 `state.<client_id>`
                cache.restore(state.defaultClient);
            }
        }
    }

    const apolloClient = new ApolloClient({
        link: httpLink,
        cache,
        ...(ssr ?
            {
                // 在服务端设置此选项以优化 SSR 时的查询
                ssrMode: true,
            } :
            {
                // 这将暂时禁用查询强制获取
                ssrForceFetchDelay: 100,
            }),
    });

    return apolloClient;
}

// 文档： https://vue-apollo.netlify.app/zh-cn/
