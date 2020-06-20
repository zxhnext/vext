// dev
const Router = require("koa-router")
const axios = require("axios")
const config = require("../../config/webpack.config")
const path = require("path")
const fs = require("fs")
// 相当于fs，但是不写入磁盘中
const MemoryFS = require("memory-fs")
const webpack = require("webpack")
const VueServerRenderer = require("vue-server-renderer")

const serverRender = require("./server-render")
const serverConfig = require("../../build/webpack.server.config")

// 运行webpack
const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFS()
// 输出到mfs
serverCompiler.outputFileSystem = mfs

// 记录每次打包生成文件
let bundle
serverCompiler.watch({}, (err, stats) => {
    // 监听，修改文件时重新打包
    if (err) throw err
    stats = stats.toJson()
    // 报出错误(不是webpack打包的错误)
    stats.errors.forEach(err => console.log(err))
    // 报出警告
    stats.warnings.forEach(warn => console.warn(warn))

    const bundlePath = path.join(
        // 拼接输出路径
        serverConfig.output.path,
        "vue-ssr-server-bundle.json"
    )
    // 读取文件
    bundle = JSON.parse(mfs.readFileSync(bundlePath, "utf-8"))
    console.log("new bundle generated")
})

const handleSSR = async ctx => {
    if (!bundle) {
        ctx.body = "你等一会，别着急......"
        return
    }

    const clientManifestResp = await axios.get(
        // 获取vue-ssr-client-manifest.json
        `${config.cdnUrl}vue-ssr-client-manifest.json`
    )
    const clientManifest = clientManifestResp.data

    const template = fs.readFileSync(
        // 读取模版
        path.join(__dirname, "../server.template.ejs"),
        "utf-8"
    )

    // 创建一个 Renderer 实例
    const renderer = VueServerRenderer.createBundleRenderer(bundle, {
        inject: false, // 不使用vue自己的模版
        clientManifest // 带有script标签的js文件引用
    })

    await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get("*", handleSSR)

module.exports = router
