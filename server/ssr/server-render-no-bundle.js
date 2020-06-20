// 模版渲染
const ejs = require('ejs')
const fs = require('fs');
const path = require('path');
const config = require("../../config/webpack.config")
// const isDev = process.env.NODE_ENV === "development"

const splitPath = (path) => {
    let pathList = path.split('/')
    let pathDir = '../../dist'
    pathList.forEach(path => {
        path && (pathDir += '/' + path)
    })
    return pathDir + '/index.html'
}

module.exports = async (ctx, renderer, template, bundle, cacheAble, microCache) => {
    ctx.headers['Content-Type'] = 'text/html'

    const context = {
        url: ctx.path
    } // user: ctx.session.user

    try {
        const app = await bundle(context) // 调用bundle方法

        // if (context.router.currentRoute.fullPath !== ctx.path) {
        //   return ctx.redirect(context.router.currentRoute.fullPath)
        // }

        if (!context.router.currentRoute.meta.isSSR) {
            let indexPath = config.isPWA ? '../page/index.html' : '../../dist/index.html'
            let staticPath = config.prerenderRoutes.includes(context.router.currentRoute.path) ?
                splitPath(context.router.currentRoute.path) : indexPath
            let html = fs.readFileSync(path.resolve(__dirname, staticPath), 'utf-8');
            ctx.type = 'html';
            ctx.status = 200;
            return ctx.body = html;
            // return ctx.redirect(`${isDev ? config.devClientUrl : config.prodClientUrl}${ctx.path}`)
        }
        const appString = await renderer.renderToString(app, context)
        const {
            title
        } = context.meta.inject()


        const html = ejs.render(template, {
            appString,
            style: context.renderStyles(),
            scripts: context.renderScripts(),
            title: title.text(),
            initalState: context.renderState()
        })
        ctx.body = html
        if (cacheAble) {
            microCache.set(ctx.url, html)
        }
    } catch (err) {
        console.log('render error', err)
        throw err
    }
}
