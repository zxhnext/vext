const path = require("path");
const Koa = require("koa");
const send = require("koa-send");
// 解决文件上传和post json
const koaBody = require("koa-body");
// 错误处理
const error = require("koa-json-error");
// 校验参数
const parameter = require("koa-parameter");
// 处理跨域
const cors = require("koa2-cors");
const webpackConfig = require("../config/webpack.config")
const mongoose = require("mongoose");

const routes = require("./routes");
const config = require("./config");

const app = new Koa();
const isDev = process.env.NODE_ENV === "development";

/* 连接mongoose */
mongoose.connect(
    config.connectionStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log("mongodb连接成功!");
    }
);
mongoose.connection.on("error", console.error);
/* 连接mongoose */


/* 容错处理 */
app.use(async (ctx, next) => {
    try {
        console.log(`request with path ${ctx.path}`);
        await next();
    } catch (err) {
        console.log(err);
        ctx.status = 500;
        ctx.body = isDev ? err.message : "please try again later";
    }
});
/* 容错处理 */

/* 处理favicon.ico */
app.use(async (ctx, next) => {
    if (ctx.path === "/favicon.ico") {
        await send(ctx, "/favicon.ico", {
            root: path.join(__dirname, "../"),
        });
    } else {
        await next();
    }
});
/* 处理favicon.ico */

/* 处理error */
app.use(
    error({
        postFormat: (e, {
                stack,
                ...rest
            }) =>
            process.env.NODE_ENV === "production" ?
            rest : {
                stack,
                ...rest,
            },
    })
);
/* 处理error */

/* 静态文件处理 */
if (webpackConfig.isPWA) {
    const serve = require('koa-static')
    app.use(serve(path.resolve(__dirname, '../dist')))
} else {
    const staticRouter = require("./static");
    app.use(staticRouter.routes()).use(staticRouter.allowedMethods());
}



// 全部允许跨域
app.use(
    cors({
        // 是否允许发送Cookie
        credentials: true,
    })
);

app.use(
    koaBody({
        // 支持文件
        multipart: true,
        formidable: {
            // 设置上传目录
            uploadDir: path.join(__dirname, "/public/uploads"),
            // 保留后缀名
            keepExtensions: true,
        },
    })
);
// 参数校验
app.use(parameter(app));
routes(app);

/* ssr */
let pageRouter = isDev ?
    require("./ssr/dev-ssr-no-bundle") :
    require("./ssr/ssr-no-bundle");

if (isDev) {
    // pageRouter = require('./ssr/dev-ssr')
} else {
    // pageRouter = require('./ssr/ssr')
}
app.use(pageRouter.routes()).use(pageRouter.allowedMethods());
/* ssr */

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3333;

app.listen(PORT, HOST, () => {
    console.log(
        `server is listening on ${HOST}:${PORT}`
    );
});
