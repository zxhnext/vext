const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const VueServerRender = require('vue-server-renderer')
const config = require("../../config/webpack.config")
const LRU = require("lru-cache")
const bundle = require('../../server-build/server-entry.js').default
const microCache = new LRU({
    max: 100,
    maxAge: 1000 // 重要提示：条目在 1 秒后过期。
})

const serverRender = require('./server-render-no-bundle')

// const clientManifest = require('../../dist/vue-ssr-client-manifest.json')
const handleSSR = async (ctx) => {
    let clientManifest
    if (config.isPWA) {
        clientManifest = require('../../dist/vue-ssr-client-manifest.json')
    } else {
        const clientManifestResp = await axios.get(
            `${config.cdnUrl}vue-ssr-client-manifest.json`
        )
        clientManifest = clientManifestResp.data
    }

    const renderer = VueServerRender.createRenderer({
        inject: false,
        clientManifest
    })

    const template = fs.readFileSync(
        path.join(__dirname, '../server.template.ejs'),
        'utf-8'
    )

    const isCacheAble = ctx => {
        return true
        // 实现逻辑为，检查请求是否是用户特定(user-specific)。
        // 只有非用户特定 (non-user-specific) 页面才会缓存
    }

    const cacheAble = isCacheAble(ctx)
    if (cacheAble) {
        const hit = microCache.get(ctx.url)
        if (hit) {
            return (ctx.body = hit)
        }
    }
    await serverRender(ctx, renderer, template, bundle, cacheAble, microCache)
}


const pageRouter = new Router()

pageRouter.get('*', handleSSR)

module.exports = pageRouter
