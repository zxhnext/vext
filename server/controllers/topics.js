const Topic = require('../models/topics');
const User = require('../models/users');
const Question = require('../models/questions');

class TopicsCtl {
    /**
     * @memberof TopicsCtl
     * 获取话题列表
     * @api {get} /topics
     * @param per_page {Number} 返回几条数据
     * @param page {Number} 第几页
     * @param q {String} 关键词搜索
     */
    async find(ctx) { // 话题查询
        const {
            per_page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1; // 第几页
        const perPage = Math.max(per_page * 1, 1); // 每页返回几条
        ctx.body = await Topic
            .find({ // 模糊搜索,关键词搜索
                name: new RegExp(ctx.query.q)
            })
            .limit(perPage).skip(page * perPage);
    }

    /**
     * @memberof TopicsCtl
     * 特定话题查询
     * @api {get} /topics/:id
     * @param id { String } 话题id
     * @param fields {String} 用户需要展示的信息字段，以;隔开
     */
    async findById(ctx) {
        const {
            fields = ''
        } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const topic = await Topic.findById(ctx.params.id).select(selectFields);
        ctx.body = topic;
    }

    /**
     * @memberof TopicsCtl
     * 创建话题
     * @api {post} /topics
     * @param name { String } 话题名(required: true)
     * @param avatar_url {String} 话题图标(required: false)
     * @param introduction {String} 话题介绍(required: false)
     */
    async create(ctx) { // 创建话题
        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            avatar_url: {
                type: 'string',
                required: false
            },
            introduction: {
                type: 'string',
                required: false
            },
        });
        const topic = await new Topic(ctx.request.body).save();
        ctx.body = topic;
    }

    /**
     * @memberof TopicsCtl
     * 更新话题
     * @api {patch} /topics/:id
     * @param id { String } 话题id
     * @param name { String } 话题名(required: false)
     * @param avatar_url {String} 话题图标(required: false)
     * @param introduction {String} 话题介绍(required: false)
     */
    async update(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: false
            },
            avatar_url: {
                type: 'string',
                required: false
            },
            introduction: {
                type: 'string',
                required: false
            },
        });
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = topic;
    }
    
     /**
     * @memberof TopicsCtl
     * 关注该话题的用户列表
     * @api {get} /topics/:id/followers
     * @param id { String } 话题id
     */
    async listFollowers(ctx) {
        const users = await User.find({
            followingTopics: ctx.params.id
        });
        ctx.body = users;
    }

    /**
     * @memberof TopicsCtl
     * 话题列表关联问题列表
     * @api {get} /topics/:id/questions
     * @param id { String } 话题id
     */
    async listQuestions(ctx) {
        const questions = await Question.find({
            topics: ctx.params.id
        });
        ctx.body = questions;
    }

    // 检查话题是否存在
    async checkTopicExist(ctx, next) {
        const topic = await Topic.findById(ctx.params.id);
        if (!topic) {
            ctx.throw(404, '话题不存在');
        }
        await next();
    }
}

module.exports = new TopicsCtl();