// dev
const Router = require('koa-router')
const config = require("../../config/webpack.config")
const axios = require('axios')
const path = require('path')
const fs = require('fs')
// const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverRender = require('./server-render-no-bundle')
const serverConfig = require('../../build/webpack.server.config')

// const NativeModule = require('module')
// const vm = require('vm')

const serverCompiler = webpack(serverConfig)
// const mfs = new MemoryFS()
// serverCompiler.outputFileSystem = mfs

let bundle
serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.log(err))
    stats.warnings.forEach(warn => console.warn(warn))

    const bundlePath = path.join(
        serverConfig.output.path,
        'server-entry.js'
    )

    // 使用mfs，因为mfs写在内存中，无法读取异步组件的js，所以不用mfs，如果要使用mfs(注释部分)，则需要将异步组件改为同步
    // 删除之前的
    delete require.cache[bundlePath]
    bundle = require('../../server-build/server-entry.js').default

    // try {
    //   const m = { exports: {} }
    //   const bundleStr = mfs.readFileSync(bundlePath, 'utf-8')
    //   const wrapper = NativeModule.wrap(bundleStr) // 用模块封装bundleStr，相当于function (module, exports, require){}
    //   const script = new vm.Script(wrapper, { // new一个可执行的js内容
    //     filename: 'server-entry.js', // 设置js名字
    //     displayErrors: true // 是否显示错误
    //   })
    //   const result = script.runInThisContext() // 上下文
    //   result.call(m.exports, m.exports, require, m) // 调用
    //   bundle = m.exports.default
    // } catch (err) {
    //   console.error('compile js error:', err)
    // }
    console.log('new bundle generated')
})

const handleSSR = async (ctx) => {
    if (!bundle) {
        ctx.body = '你等一会，别着急......'
        return
    }

    const clientManifestResp = await axios.get(
        `${config.cdnUrl}vue-ssr-client-manifest.json`
    )
    const clientManifest = clientManifestResp.data

    const template = fs.readFileSync(
        path.join(__dirname, '../server.template.ejs'),
        'utf-8'
    )

    const renderer = VueServerRenderer
        .createRenderer({
            inject: false,
            clientManifest
        })

    await serverRender(ctx, renderer, template, bundle)
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
