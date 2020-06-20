const Koa = require('koa');
const mongoose = require("mongoose");
// 处理跨域
const cors = require("koa2-cors");
const {
    ApolloServer,
} = require('apollo-server-koa');
const config = require("./config");

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

// Construct a schema, using GraphQL schema language
const {
    typeDefs,
    resolvers
} = require('./graphql/schema')

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const app = new Koa();
server.applyMiddleware({
    app
});

// 全部允许跨域
app.use(
    cors({
        // 是否允许发送Cookie
        credentials: true,
    })
);

// alternatively you can get a composed middleware from the apollo server
// app.use(server.getMiddleware());

app.listen({
        port: 4000
    }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
