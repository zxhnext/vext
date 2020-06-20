const path = require("path")
const config = require("../config/webpack.config")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
// vue-loader配置项
const createVueLoaderOptions = require("./vue-loader.config")
// HappyPack
const HappyPack = require("happypack")
const {
    cpus,
} = require("os")
const HappyThreadPool = HappyPack.ThreadPool({
    size: cpus().length,
})
// tree shaking
const WebpackDeepScopePlugin = require("webpack-deep-scope-plugin").default
// 打包进度条
const ProgressBarPlugin = require("progress-bar-webpack-plugin")
// 优化错误提示
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")
// 编译完成弹出消息
const WebpackBuildNotifierPlugin = require("webpack-build-notifier")
// 测量出在构建过程中，每一个Loader和Plugin的执行时长, 无法与你自己编写的挂载在html-webpack-plugin提供的hooks上的自定义Plugin(add-asset-html-webpack-plugin)就是此类共存
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin({
    outputFormat: "zxh",
})
// 设置item2窗口标题
const badge = require("set-iterm2-badge")
badge("my-project")

const isDev = process.env.NODE_ENV === "development"

const baseConfig = smp.wrap({
    entry: path.join(__dirname, "../client/client-entry.js"),
    output: {
        filename: "bundle.[hash:8].js",
        path: path.join(__dirname, "../dist"),
        // 设置域名，否则服务端渲染时在entry-server.js中添加的路由会去请求服务端端口下的文件(如/main.css)，是找不到的
        // publicPath: config.cdnUrl,
        publicPath: config.isPWA ? '' : config.cdnUrl
    },
    mode: process.env.NODE_ENV || "production",
    resolve: {
        extensions: [".js", ".vue"],
        // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
        mainFields: ["jsnext:main", "browser", "main"],
    },
    module: {
        rules: [{
                test: /\.(vue|js|jsx)$/,
                // cache-loader 在一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里。
                use: ["cache-loader", "eslint-loader"],
                exclude: /node_modules/,
                // 用loader处理之前先用eslint预处理
                enforce: "pre",
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: createVueLoaderOptions(isDev),
            },
            {
                test: /\.jsx$/,
                loader: "babel-loader",
            },
            {
                test: /\.js$/,
                // loader: "babel-loader",
                exclude: /node_modules/,
                use: "happypack/loader?id=js",
            },
            //将小于1024d的图片转为base64，减少http请求
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 1024,
                        name: "[name].[ext]",
                        outputPath: "assets/img/",
                    }
                }]
            },
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader'
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HappyPack({
            id: "js",
            use: [{
                loader: "babel-loader",
            }],
            //共享进程池
            threadPool: HappyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
            // 开启四个线程
            threads: 4
        }),
        new WebpackDeepScopePlugin(),
        new ProgressBarPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new WebpackBuildNotifierPlugin({
            title: "My Project Webpack Build",
            logo: path.resolve("../favicon.ico"),
            suppressSuccess: true,
        }),
    ]
})

module.exports = baseConfig
