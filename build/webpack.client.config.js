const path = require("path")
const config = require("../config/webpack.config")
const baseConfig = require("./webpack.base.config")
const {
    cssModule,
    stylusModule,
} = require('./base.config')
const webpack = require("webpack")
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
    // 将CSS提取为独立的文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
    // 压缩单独的css文件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
    // 多进程压缩js，每个子进程还是通过UglifyJS去压缩
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin")
    // 压缩js
const TerserPlugin = require("terser-webpack-plugin")
    // webpack打包进内联html
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin")
    // 将runtime内联到的index.html
const InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin")
    // 生成一份manifest.json的文件，显示文件映射关系
const ManifestPlugin = require("webpack-manifest-plugin")
    // 预渲染
const PrerenderSPAPlugin = require("prerender-spa-plugin")
const VueClientPlugin = require('vue-server-renderer/client-plugin')
    // 骨架屏
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
const {
    CleanWebpackPlugin,
} = require("clean-webpack-plugin")
    // 生成页面代码
const {
    SkeletonPlugin,
} = require('page-skeleton-webpack-plugin')

// 直观显示webpack构建
const DashboardPlugin = require("webpack-dashboard/plugin")
    // 打包性能分析
    // const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    //     .BundleAnalyzerPlugin

// // 将js插入html中(配合dll使用)
// const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin")
// // 通过 Facebook 的 Prepack 优化输出的 JavaScript 代码性能
// const PrepackWebpackPlugin = require("prepack-webpack-plugin").default
// // 去除无用css
// const PurifyCSS = require("purifycss-webpack")
// const glob = require("glob-all")
// // 压缩图片
// const ImageminPlugin = require("imagemin-webpack-plugin").default


const isDev = process.env.NODE_ENV === "development"

const defaultPluins = [
    new webpack.DefinePlugin({
        // 允许创建一个在编译时可以配置的全局常量
        "process.env": {
            NODE_ENV: isDev ? '"development"' : '"production"',
        }
    }),
    new HtmlWebpackPlugin({
        minify: {
            // 清除空格
            collapseWhitespace: true,
            // 清除多余引号
            removeAttributeQuotes: true,
            // 删除注释
            removeComments: true
        },
        template: path.resolve(__dirname, "../index.html"),
        favicon: "./favicon.ico",
        inlineSource: ".(js|css)$",
    }),
    new VueClientPlugin(),
]

// // dll
// const files = fs.readdirSync(path.resolve(__dirname, "../dll"))
// files.forEach(file => {
//     if (/.*\.dll.js/.test(file)) {
//         defaultPluins.push(
//             new AddAssetHtmlWebpackPlugin({
//                 filepath: path.resolve(__dirname, "../dll", file),
//             })
//         )
//     }
//     if (/.*\.manifest.json/.test(file)) {
//         defaultPluins.push(
//             new webpack.DllReferencePlugin({
//                 manifest: path.resolve(__dirname, "../dll", file),
//             })
//         )
//     }
// })

const devServer = {
    port: config.devClientPort,
    host: config.host,
    overlay: {
        // 有错会在浏览器中提示
        errors: true,
    },
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: {
        // dev时设置index.html路径，否则history模式下刷新页面路由会请求后段路由
        index: "/index.html",
    },
    proxy: {
        "/users": {
            target: "http://localhost:3333",
            // 重写接口
            pathRewrite: {
                '^/users': ''
            },
        },
    },
    hot: true,
    // Hot Module Replacement 热模块更新, HotModuleReplacementPlugin失效时，重新刷新一次页面
    hotOnly: true,
}

const clientModule = {
    rules: [
        stylusModule(isDev),
        cssModule(isDev)
    ]
}

let devtool = config.sourceMap[isDev ? "development" : "production"]


const devClientConfig = merge(baseConfig, {
    devtool,
    module: clientModule,
    devServer,
    plugins: defaultPluins.concat([
        // 热更新
        new webpack.HotModuleReplacementPlugin(),
        // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
        // new webpack.NoEmitOnErrorsPlugin()
        new HtmlWebpackInlineSourcePlugin(),
        // 当启用 HMR 时，使用该插件会显示模块的相对路径
        // 建议用于开发环境
        new webpack.NamedModulesPlugin(),
        // webpack 内部维护了一个自增的 id，每个 chunk 都有一个 id。
        // 所以当增加 entry 或者其他类型 chunk 的时候，id 就会变化，
        // 导致内容没有变化的 chunk 的 id 也发生了变化
        // NamedChunksPlugin 将内部 chunk id 映射成一个字符串标识符（模块的相对路径）
        // 这样 chunk id 就稳定了下来
        new webpack.NamedChunksPlugin(),
        new SkeletonPlugin({
            pathname: path.resolve(__dirname, '../shell'), // 用来存储 shell 文件的地址
            staticDir: path.resolve(__dirname, '../dist'), // 最好和 `output.path` 相同
            routes: ['/'], // 将需要生成骨架屏的路由添加到数组中
        }),
        // new ImageminPlugin({
        //   disable: true, // Disable during development,
        //   pngquant: {
        //     quality: "95-100",
        //   }
        // })
    ]),
    optimization: {
        // tree-shaking
        usedExports: true
    }
})


const prodPlugins = defaultPluins.concat([
    new CleanWebpackPlugin(),
    // 打包js起名
    new webpack.NamedChunksPlugin(),
    new MiniCssExtractPlugin({
        filename: "assets/css/[name].client.css",
        chunkFilename: "assets/css/[id].client.css",
        ignoreOrder: false,
    }),
    new SkeletonWebpackPlugin({
        webpackConfig: require('./webpack.skeleton.config.js'),
        quiet: true,
        router: {
            mode: 'history',
            routes: config.skeletonRoutes
        }
    }),
    new PrerenderSPAPlugin({
        // 生成文件的路径，也可以与webpakc打包的一致。
        // 下面这句话非常重要！！！
        // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
        staticDir: path.join(__dirname, "../dist"),
        // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
        routes: config.prerenderRoutes,
        // 这个很重要，如果没有配置这段，也不会进行预编译
        // renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
        //   //这样写renderAfterTime生效了
        //   renderAfterTime: 5000,
        //   renderAfterDocumentEvent: 'render-event', // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上
        // })
    }),
    // 使用 ParallelUglifyPlugin 并行压缩输出JS代码
    new ParallelUglifyPlugin({
        cacheDir: ".cache/", // 设置缓存路径，不改动的调用缓存，第二次及后面build时提速
        exclude: /node_modules/,
        sourceMap: false,
        // 传递给 UglifyJS的参数如下：
        uglifyES: {
            output: {
                /*
                 是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，
                 可以设置为false
                */
                beautify: false,
                /*
                 是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
                */
                comments: false
            },
            /*
              是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出，可以设置为false关闭这些作用
              不大的警告
            */
            warnings: false,
            compress: {
                /*
                 是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
                */
                drop_console: true,

                /*
                 是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 5, 默认为不
                 转换，为了达到更好的压缩效果，可以设置为false
                */
                collapse_vars: true,

                /*
                 是否提取出现了多次但是没有定义成变量去引用的静态值，比如将 x = 'xxx'; y = 'xxx'  转换成
                 var a = 'xxxx'; x = a; y = a; 默认为不转换，为了达到更好的压缩效果，可以设置为false
                */
                reduce_vars: true
            }
        }
    }),
    // 预编译所有模块到一个闭包中，提升代码在浏览器中的执行速度
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。
    // 这样可以确保输出资源不会包含错误
    new webpack.NoEmitOnErrorsPlugin(),
    new ManifestPlugin(),
    new webpack.BannerPlugin("xiaohannext@qq.com"),
    new InlineManifestWebpackPlugin("runtime"),
    new DashboardPlugin(),
    // new BundleAnalyzerPlugin({
    //     analyzerPort: 8999
    // }),
    // new PrepackWebpackPlugin(),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "common",
    //   filename: "common.js"
    // }),
    // new PurifyCSS({
    //   paths: glob.sync([path.join(__dirname, "client/*.html")])
    // }),
])

if (config.isPWA) {
    // service-worker
    const {
        GenerateSW,
        // InjectManifest,
    } = require('workbox-webpack-plugin')
    prodPlugins.push(
        new GenerateSW({
            // importWorkboxFrom: 'local',
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [{
                    // To match cross-origin requests, use a RegExp that matches
                    // the start of the origin:
                    urlPattern: new RegExp('^https://api'),
                    handler: 'StaleWhileRevalidate',
                    options: {
                        // Configure which responses are considered cacheable.
                        cacheableResponse: {
                            statuses: [200]
                        }
                    }
                },
                {
                    urlPattern: new RegExp('^https://cdn'),
                    // Apply a network-first strategy.
                    handler: 'NetworkFirst',
                    options: {
                        // Fall back to the cache after 2 seconds.
                        networkTimeoutSeconds: 2,
                        cacheableResponse: {
                            statuses: [200]
                        }
                    }
                }
            ]
        })
    )
}

const prodClientConfig = merge(baseConfig, {
    entry: {
        app: path.join(__dirname, "../client/client-entry.js"),
        vendor: ["vue"]
    },
    output: {
        filename: "[name].[chunkhash:8].js",
    },
    module: clientModule,
    devtool,
    plugins: prodPlugins,
    optimization: {
        // 移除无用的框架的代码的警告
        nodeEnv: "production",
        // tree-shaking
        usedExports: true,
        minimizer: [new OptimizeCSSAssetsPlugin({}), new TerserPlugin()],
        splitChunks: {
            // 同步异步都生效
            chunks: "all",
            cacheGroups: {
                // 打包到一个css中
                styles: {
                    name: "styles",
                    test: /\.(css|styl)$/,
                    chunks: "all",
                    enforce: true
                },
                commons: {
                    chunks: "initial",
                    name: "commons",
                    minChunks: 3,
                    minSize: 0
                }
            }
        },
        // runtimeChunk: {
        //     // 兼容老版本的webpack， 包与包之间的关系的文件，新版本无问题
        //     name: "runtime"
        // }
    },
})


// config.resolve = {
//     alias: {
//         model: path.join(__dirname, "../client/model/client-model.js")
//     }
// }

module.exports = isDev ? devClientConfig : prodClientConfig