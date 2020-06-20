import Vuex from 'vuex'

import defaultState from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

const isDev = process.env.NODE_ENV === 'development'

export default () => {
    const store = new Vuex.Store({
        strict: isDev, // 规范代码，不允许直接修改state
        state: defaultState,
        mutations,
        getters,
        actions
        // plugins: [ // 一个数组，可以放置很多钩子函数
        //   (store) => {
        //     console.log('my plugin invoked')
        //   }
        // ]
        // modules: {
        //   a: {
        //     namespaced: true, // 开启后每个模块中有相同名字不会冲突
        //     state: { // 调用时this.$store.state.a.text
        //       text: 1
        //     },
        //     mutations: {
        //       updateText (state, text) { // 调用时this["a/updateText"].updateText()
        //         console.log('a.state', state)
        //         state.text = text
        //       }
        //     },
        //     getters: {
        //       textPlus (state, getters, rootState) {
        //         return state.text + rootState.b.text
        //       }
        //     },
        //     actions: {
        //       add ({ state, commit, rootState }) {
        //         commit('updateCount', { num: 56789 }, { root: true })
        //       }
        //     }
        //   },
        //   b: {
        //     namespaced: true,
        //     state: {
        //       text: 2
        //     },
        //     actions: {
        //       testAction ({ commit }) {
        //         commit('a/updateText', 'test text', { root: true })
        //       }
        //     }
        //   }
        // }
    })

    if (module.hot) { // vuex热更新
        module.hot.accept([
            './state/state',
            './mutations/mutations',
            './actions/actions',
            './getters/getters'
        ], () => {
            const newState = require('./state/state').default
            const newMutations = require('./mutations/mutations').default
            const newActions = require('./actions/actions').default
            const newGetters = require('./getters/getters').default

            store.hotUpdate({
                state: newState,
                mutations: newMutations,
                getters: newGetters,
                actions: newActions
            })
        })
    }

    return store
}
