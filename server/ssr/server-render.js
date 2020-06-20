// 渲染模版
const ejs = require('ejs')

module.exports = async (ctx, renderer, template) => {
    ctx.headers['Content-Type'] = 'text/html'

    // 包括客户端js,css路径等,title,等等
    const context = {
        url: ctx.path,
        // user: ctx.session.user
    } //  传入用户名
    try {
        // 将 Vue 实例渲染为字符串
        // bundle renderer 在调用 renderToString 时，它将自动执行「由 bundle 创建的应用程序实例」(server-entry.js中的函数)所导出的函数（传入上下文作为参数），然后渲染它。
        const appString = await renderer.renderToString(context) // 执行完后在server-entry又给context增加了3个属性

        // if (context.router.currentRoute.fullPath !== ctx.path) {
        //   return ctx.redirect(context.router.currentRoute.fullPath)
        // }

        const {
            title
        } = context.meta.inject()

        const html = ejs.render(template, {
            appString,
            style: context.renderStyles(),
            scripts: context.renderScripts(),
            title: title.text(),
            initalState: context.renderState() // 注入store
        })
        ctx.body = html
    } catch (err) {
        console.log('render error', err)
        throw err
    }
}
