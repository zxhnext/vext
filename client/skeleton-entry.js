import Vue from 'vue'
// import SkeletonQuestion from './views/skeleton/skeleton-question.vue'
// import SkeletonMy from './views/skeleton/skeleton-my.vue'

import skeleton from "./views/skeleton/index"
Vue.use(skeleton)

let skeletonComponents = Vue.prototype.skeletonComponents
let domTrees = '';
skeletonComponents.forEach(filename => {
    domTrees += `<${filename} id="${filename}" style="display:none" />`
})

export default new Vue({
    template: `
    <div>
      ${domTrees}
    </div>
  `
    // template: '<SkeletonMy />'
})
