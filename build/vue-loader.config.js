// vue配置项
// const docsLoader = require.resolve('./docs-loader')
module.exports = (isDev) => {
    return {
        // 去掉vue模版中的空格
        preserveWhitepace: true,
        // 把vue文件中的css打包成单独文件
        extractCSS: !isDev,
        // css模块支持(在style标签中加上module即可开启 如:<style module>, 绑定时需要:class="$style.header")
        cssModules: {
            // 将模块中的class生成独一无二的class
            localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
            // 把 css转为驼峰命名
            camelCase: true,
        },
        // 根据环境变量生成
        hotReload: false,
        // 自定义loader
        loaders: {
            // 指定docs标签(如template, script等)用doceLoader解析
            // 'docs': docsLoader 
        },
        // 在用loaders中的loader解析之前，先执行preLoader中的loader
        preLoader: {

        },
        // loaders解析完之后再用postLoader中的loader解析
        postLoader: {

        },
    }
}
