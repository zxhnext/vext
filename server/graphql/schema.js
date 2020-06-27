const {
    gql
} = require('apollo-server-koa')
const usersModel = require('../models/users')

const typeDefs = gql `
  type User {
    name: String,
    password: String,
    gender: String,
    _id: ID
  }
  type Query {
    getUsers: [User]
  }
  type Mutation {
      createUsers(name: String, password: String): User
  }
  type Success {
      name: String,
      password: String
  }
  input userInput {
      name: String
      password: String,
  }
`

const resolvers = {
    Query: {
        getUsers: async (per_page, page, q) => {
            // ctx.set('Allow', 'GET, POST') // 设置响应头
            // ctx.status = 200
            const Page = Math.max(page * 1, 1) - 1; // 第几页
            const perPage = Math.max(per_page * 1, 1); // 第多少条数据
            return await usersModel
                .find({ // 模糊搜索，关键词搜索
                    name: new RegExp(q)
                })
                .limit(perPage).skip(Page * perPage); // 从第page * perPage条数据开始，返回perPage条
        },
    },
    Mutation: {
        createUsers: async (parent, {
            name,
            password
        }, context, info) => {
            const repeatedUser = await usersModel.findOne({
                name
            })
            if (repeatedUser) {
                return {
                    msg: '用户已存在'
                }
            }
            return await new usersModel({
                name,
                password
            }).save()
        }
    }
}

module.exports = {
    resolvers,
    typeDefs
}
