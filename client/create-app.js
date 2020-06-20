import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
// import MetaInfo from 'vue-meta-info'
import Meta from "vue-meta";

import App from "./app.vue";
import createStore from "./store/store";
import createRouter from "./router";
import VueApollo from 'vue-apollo'
import {
    createApolloClient
} from './graphql';

import "./assets/styles/global.styl";

import login from "./components/login";
import layout from "./layout";
import api from "./api/api.js";
// import config from '../config/webpack.config'
Vue.use(login);
Vue.use(layout);
Vue.prototype.$api = api;
// Object.defineProperty(Vue.prototype, '$api', {
//   get() {
//       return api
//   }
// })

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(Vuex);
// Vue.use(MetaInfo)
Vue.use(Meta);

export default (context) => {
    const router = createRouter();
    const store = createStore();

    // Vuex 状态恢复
    if (!context.ssr && window.__INITIAL_STATE__) {
        // 我们使用服务端注入的数据来初始化 store 状态
        store.replaceState(window.__INITIAL_STATE__)
    }

    const apolloClient = createApolloClient(context.ssr)
    const apolloProvider = new VueApollo({
        defaultClient: apolloClient,
    })

    const app = new Vue({
        router,
        store,
        apolloProvider, //注册全局组件
        render: h => h(App),
        // 添加mounted，不然不会执行预编译
        mounted() {
            document.dispatchEvent(new Event("render-event"));
        }
    });

    return {
        app,
        router,
        store,
        apolloProvider
    };
};
