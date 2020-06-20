// import Vue from 'vue'
// import { createLocalVue, shallowMount } from '@vue/test-utils' // shallowMount 浅渲染，只渲染这一层，子组件不渲染
// import HelloWorld from '@/components/HelloWorld'
// import NutUI from '@nutui/nutui'
// import '@nutui/nutui/dist/nutui.css'

// NutUI.install(Vue)
import { add } from '../../client/util/test'

describe('utils add 测试', () => {
  it('期望add(1)=2', () => {
    // const localVue = createLocalVue()
    // localVue.use(NutUI)
    // const msg = 'new message'
    // const wrapper = shallowMount(HelloWorld, {
    //   propsData: { msg },
    //   localVue
    // })
    expect(add(1)).toBe(2)
  })
})
