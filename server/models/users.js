const mongoose = require('mongoose')

const {
    Schema,
    model
} = mongoose

const userSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // 不显示密码
    },
    avatar_url: {
        type: String
    },
    gender: {
        type: String,
        enum: ['male', 'female'], // 可枚举
        default: 'male',
        required: true
    },
    headline: { // 一句话简介
        type: String
    },
    locations: { // 居住地
        type: [{ // 数组对象类型
            type: Schema.Types.ObjectId, // 引用类型()关联话题引用
            ref: 'Topic' // 话题引用
        }],
        select: false
    },
    business: { // 行业
        type: Schema.Types.ObjectId,
        ref: 'Topic',
        select: false
    },
    employments: { // 职业经历
        type: [{
            company: { // 公司名
                type: Schema.Types.ObjectId,
                ref: 'Topic'
            },
            job: { // 职位
                type: Schema.Types.ObjectId,
                ref: 'Topic'
            },
        }],
        select: false,
    },
    educations: { // 教育经历
        type: [{
            school: {
                type: Schema.Types.ObjectId,
                ref: 'Topic'
            },
            major: { // 专业
                type: Schema.Types.ObjectId,
                ref: 'Topic'
            },
            diploma: { // 学历
                type: Number,
                enum: [1, 2, 3, 4, 5]
            },
            entrance_year: { // 入学年份
                type: Number
            },
            graduation_year: { // 毕业年份
                type: Number
            },
        }],
        select: false,
    },
    following: { // 关注的用户
        type: [{
            type: Schema.Types.ObjectId, // 用户id
            ref: 'User' // id与User表相关联
        }],
        select: false,
    },
    followingTopics: { // 关注的话题
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Topic'
        }],
        select: false,
    },
    likingAnswers: { // 赞过的答案
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Answer'
        }],
        select: false,
    },
    dislikingAnswers: { // 踩过的答案
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Answer'
        }],
        select: false,
    },
    collectingAnswers: { // 收藏的答案
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Answer'
        }],
        select: false,
    }
}, {
    timestamps: true
})

module.exports = model('User', userSchema)