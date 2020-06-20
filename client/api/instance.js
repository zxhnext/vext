import axios from 'axios'
import {
    Toast
} from '@nutui/nutui'
import utils from '../util/utils.js'
axios.defaults.withCredentials = true

// 构建axios实例
const instance = axios.create({
    // baseURL: process.env.BASE_API,  // 该处url会根据开发环境进行变化（开发/发布）
    timeout: 10000 // 设置请求超时连接时间
})

instance.interceptors.request.use(
    config => {
        let token = utils.isClient() ? localStorage.getItem("token") : ''
        config.headers.common['Authorization'] = `Bearer ${token}`
        return config // 对config处理完后返回，下一步将向后端发送请求
    },
    error => { // 当发生错误时，执行该部分代码
        console.log("request error:", error) // 调试用
        Toast.fail(error)
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response => { // 该处为后端返回整个内容
        if (response.status === 200) {
            return response // 该处将结果返回，下一步可用于前端页面渲染用
        } else {
            Toast.fail('error')
            return Promise.reject('error')
        }
    },
    error => {
        console.log("response error:", error),
            Toast.fail(error)
        return Promise.reject(error)
    }
)

export default instance
