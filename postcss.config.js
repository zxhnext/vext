module.exports = {
  plugins: [
    require("postcss-import")({
      /* ...options */
    }), // 用于 inline @import 规则内容的PostCSS插件
    require("postcss-preset-env")({
      /* ...options */
    }), // 将现代CSS转换成浏览器能理解的东西
    require("postcss-url")({
      /* ...options */
    }), // 用于转换 url ( )，inline 或者复制资产的PostCSS插件
    require("postcss-cssnext")({
      /* ...options */
    }),
    require("cssnano")({
      /* ...options */
    }), // 将你的 CSS 文件做多方面的的优化，以确保最终生成的文件 对生产环境来说体积是最小的。
    // require('precss')({})
    require("postcss-pxtorem")()
  ]
};
