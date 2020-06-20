const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const baseConfig = require("./webpack.base.config")
const {
    cssModule,
    stylusModule,
} = require('./base.config')
const {
    CleanWebpackPlugin,
} = require("clean-webpack-plugin")
// const VueServerPlugin = require("vue-server-renderer/server-plugin");

let serverConfig

const defaultPluins = [
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
            process.env.NODE_ENV || "development"
        ),
        "process.env.VUE_ENV": '"server"'
    }),
    new CleanWebpackPlugin()
    // new VueServerPlugin() // 优化版不需要VueServerPlugin
];

serverConfig = merge(baseConfig, {
    target: "node",
    entry: path.join(__dirname, "../client/server-entry.js"),
    devtool: "source-map",
    output: {
        libraryTarget: "commonjs2",
        filename: "server-entry.js",
        path: path.join(__dirname, "../server-build")
    },
    externals: Object.keys(require("../package.json").dependencies), // 不要打包dependencies中的文件
    module: {
        rules: [
            stylusModule(true),
            cssModule(true)
        ]
    },
    plugins: defaultPluins
})

// serverConfig.resolve = {
//     alias: {
//         model: path.join(__dirname, "../client/model/server-model.js")
//     }
// }

module.exports = serverConfig
