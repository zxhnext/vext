import Vue from 'vue'
import myLogin from './login.vue'

// const obj = {}

// obj.install = function(Vue) {
//   // console.log('---', vue)
//   // 1. 创建组件构造器
//   const loginContrustor = Vue.extend(myLogin)

//   // 2. new的方式 根据组件构造器  可以创建出来一个组件对象
//   const login = new loginContrustor();

//   // 3. 将组件对象， 手动挂载到某一个元素上
//   login.$mount(document.createElement('div'))

//   // 4. toast.$el 对应的就是div
//   document.body.appendChild(login.$el);

//   Vue.prototype.$login = login
//   // console.log(toast)
// }

// export default obj

const login = Vue.extend(myLogin) // 创建alert组件的构造类

const loginFun = function (options) { // 接收配置
  // let str_num = (typeof options === 'string' || typeof options === 'number')
  console.log(options)
  const Instance = new login({ // 实例化组件
    data: { // 给data的变量赋值
    //   title: (options && options.title) || '提示',
    //   text: str_num ? options : ((options && options.text) || ''),
    //   cancelText: (options && options.cancel) || '取消',
    //   confirmText: (options && options.confirm) || '确认'
    }
  })
  let vm = Instance.$mount() // 挂载
  document.body.appendChild(vm.$el) // 插入body
  return vm
}

let install = (Vue) => { // 暴露install方法供Vue.use()调用
    if (install.installed) return // 判断是否安装
    install.installed = true // 记录安装状态
    Vue.prototype.$login = loginFun // 挂到Vue的原型上使用
  }

export default {
  install
}