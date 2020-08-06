vext 是一个基于 vue 的同构框架，它可以在客户端，服务端，以及预渲染之间自由切换，此外，在 Vue SSR 的官方文档的框架基础上，加入了二十多项 webpack 优化，并且支持开发环境下的 SSR 调试，极大地增强了我们的开发体验。下面我来介绍一下它的具体用法。

## 1. 基础用法

首先，vext 对一些基础配置做了抽离，即使你不懂 webpack 也没关系，你不用或者很少需要去修改 vext 的构建配置，它提供了 webpack.config.js 配置文件，你可以在此写入一些常用的配置项。

### 1.1 SSR

既然是同构项目，SSR 是必然少不了的，vext 在路由中配置了 SSR 开关，你可以根据需要来输入是否开启服务端渲染，如果 isSSR 为 false,那么它将和普通的 SPA 没有任何区别。来看一下 demo:

```javascript
{
    path: '/',
    props: true,
    component: Questions,
    name: '首页',
    meta: {
        title: '知乎',
        description: '知乎首页',
        isSSR: true,
    },
},
{
    path: '/my',
    meta: {
        title: '我的',
        description: '我的',
        isSSR: false,
    },
    component: () => import( /* webpackChunkName: "my-view" */ '../views/my/index.vue')
},
```

以下例子对首页做了服务端渲染，而我的页面依然走客户端渲染。

### 1.2 预渲染

vext 中对预渲染也做了处理，如果你需要对某个路由做预渲染处理，那么你只需要在`webpack.config.js`文件中写入需要预渲染的路由即可，如下所示:

```javascript
module.exports = {
    // 预渲染路由配置
    prerenderRoutes: ["/prerender", "/prerender2"]
};
```

以上例子对`/prerender`, `/prerender2`两个路由做了预渲染处理，在生产环境下，会自动生成这两个路由的静态页面。

### 1.3 骨架屏

现在很多项目中，都加入来骨架屏，vext 也同样支持骨架屏的引入，如果你需要对某个路由加入骨架屏，那么首先你需要在`client/views/skeleton`目录下创建该路由的骨架屏页面，这里我依然以`首页`和`我的`页面为例，首先我创建了`skeleton-my.vue`与`skeleton-question`两个骨架屏页面，然后我需要在`webpack.config.js`文件中做如下配置

```javascript
// 骨架屏配置
skeletonRoutes: [
    {
        path: "/", //对应使用路由
        skeletonId: "Skeleton-question" // 所用骨架屏的id标识
    },
    {
        path: "/my", //对应使用路由
        skeletonId: "Skeleton-my" // 所用骨架屏的id标识
    }
];
```

以上 demo 可看出，我们需要指明你需要骨架屏的`path`，并配置`skeletonId`, 需要注意的是，该 id 即为对应文件的文件名，并首字母大写。

到这里就结束了吗？不，vext 还提供了更炫酷的功能。如果你不想手动去写骨架屏，vext 也给出了方案去自动生成骨架屏，你只需要在开发环境中切到需要生成骨架屏的页面，在控制台中输入 toggleBar 后按回车，页面上方会出现提示，点击页面顶部的进度条，等待约十几秒后，会自动弹出骨架屏的预览页面，并将页面代码生成到你的指定目录中。

## 2. 新技术应用

### 2.1 graphql

vext 同时支持 graphql，如果你不会用，可以参考项目中的 demo。当然，如果你不仅仅满足于此，更想知道 graphql 如何在同构项目中引入的话，你可以参考[vue 官方给出的一套方案](https://vue-apollo.netlify.app/zh-cn/),如果你对 graphql 不太了解的话，请自己面壁思过(哈哈，开玩笑，具体可参考 graphql 官方文档)

### 2.2 css-next

vext 加入了对 css-next 的语法编译，你可以放心的在项目中使用 css-next 语法

### 2.3 PWA

vext 支持 PWA，但是由于 PWA 不支持跨域，所以如果你使用了 PWA，那么你只能把 css,js 等静态文件放在服务器的静态目录下，而不能选择 CDN 部署(本人技术有限，目前还没有想出更好的解决方法)。

## 3. 自动化测试

对于一个优秀的项目来说，自动化测试是必然少不了的，vext 同时提供了`单元测试`,`e2e测试`，`ui还原测试`和`接口测试`， 具体使用方法可参考我项目中的 demo 和 package.json 文件中的启动命令。另外，由于本人水平有限，目前单元测试仅支持对一些公共文件做测试(因为引入了@nutui/nutui 组件库，对组件做测试就会报错)。

## 4. 代码质量检测

### 4.1 代码规范

vexto 支持对 js，css，markdown，json 做规范检测，但是遗憾的是本项目使用的`stylelint`好像并不支持对`stylus`做检测。

### 4.2 代码重复率，代码覆盖率

vext 同时支持对代码重复率进行检测，你只需要使用`npn run jscpd`命令即可，命令结束后，会在`report`目录下自动生成一份报表。
代码覆盖率可在浏览器中查看，具体使用方法请自行百度。

### 4.3 性能监控工具

之前写了一款性能监控工具，可以对页面构建过程中各个节点所用时间，以及页面中的常见错误进行收集监控，有兴趣的可以查看我该项目的[github](https://github.com/zxhnext/web-performance-monitoring),如果你想直接使用，那么你可以在项目中通过[npm](https://www.npmjs.com/package/web-performance-monitoring)使用该包。在 vext 中也将使用该工具来对页面做性能监控。

## 5. 展望

最近，对前端技术又多了一些思考，将在后续版本中陆续对以下技术提供支持：

    1. docker 部署，jenkins 集成
    2. web components
    3. 微前端架构
    4. typescript
    5. serverless

另外也将继续对项目中的一些点做优化，如:

    6. ssr 流式生成字符串
    7. vue 代码优化
    8. 完善单元测试

最后因本人技术有限，项目中还有很多不稳定的地方，欢迎各位大佬批评，指正，也诚挚欢迎有兴趣的小伙伴一起开发。
