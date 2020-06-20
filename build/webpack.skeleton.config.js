'use strict';

const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const {
    cssModule,
    stylusModule,
} = require('./base.config')

const isDev = process.env.NODE_ENV === "development"

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = merge(baseWebpackConfig, {
    target: 'node',
    devtool: false,
    entry: {
        app: resolve('../client/skeleton-entry.js')
    },
    module: {
        rules: [
            stylusModule(isDev),
            cssModule(isDev)
        ]
    },

    output: Object.assign({}, baseWebpackConfig.output, {
        libraryTarget: 'commonjs2'
    }),
    externals: nodeExternals({
        whitelist: /\.css$/
    }),
    plugins: []
})
