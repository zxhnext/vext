/*
 * @Author: your name
 * @Date: 2020-06-20 21:54:48
 * @LastEditTime: 2020-06-27 20:58:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vext/build/webpack.skeleton.config.js
 */ 
'use strict';

const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = merge(baseWebpackConfig, {
    target: 'node',
    devtool: false,
    entry: {
        app: resolve('../client/skeleton-entry.js')
    },
    output: Object.assign({}, baseWebpackConfig.output, {
        libraryTarget: 'commonjs2'
    }),
    externals: nodeExternals({
        whitelist: /\.css$/
    }),
    plugins: []
})
