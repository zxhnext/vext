// 将CSS提取为独立的文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssModule = isDev => {
    return {
        test: /\.css/,
        use: [
            isDev
                ? "vue-style-loader"
                : {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                          // you can specify a publicPath here
                          // by default it uses publicPath in webpackOptions.output
                          // publicPath: path.resolve(__dirname, "../dist")
                          publicPath: "../../"
                          // hmr: process.env.NODE_ENV === 'development'
                      }
                  },
            "css-loader",
            {
                loader: "postcss-loader",
                options: {
                    sourceMap: true
                }
            }
        ]
    };
};

const stylusModule = isDev => {
    return {
        test: /\.styl/,
        use: [
            isDev
                ? "vue-style-loader"
                : {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                          // you can specify a publicPath here
                          // by default it uses publicPath in webpackOptions.output
                          // publicPath: path.resolve(__dirname, "../dist")
                          // hmr: process.env.NODE_ENV === 'development'
                          publicPath: "../../"
                      }
                  },
            "css-loader",
            {
                loader: "postcss-loader",
                options: {
                    sourceMap: true
                }
            },
            "stylus-loader"
        ]
    };
};

module.exports = {
    cssModule,
    stylusModule
};
