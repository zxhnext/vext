const fs = require('fs')

module.exports = (app) => {
    fs.readdirSync(__dirname).forEach(file => {
        if (file === 'index.js') return;
        const route = require(`./${file}`)
        // allowedMethods
        // 1. 响应options方法,告诉它所支持的请求方法
        // 2. 相应地返回405(不允许) 和501(没实现)
        app.use(route.routes()).use(route.allowedMethods())
    })
}