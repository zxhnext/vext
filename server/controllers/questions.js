const Question = require('../models/questions');

class QuestionsCtl {
    /**
     * @memberof QuestionsCtl
     * 获取问题列表
     * @api {get} /questions
     * @param per_page {Number} 返回几条数据
     * @param page {Number} 第几页
     * @param q {String} 关键词搜索
     */
    async find(ctx) {
        const {
            per_page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        ctx.body = await Question
            .find({
                $or: [{
                    title: q
                }, {
                    description: q
                }]
            })
            .limit(perPage).skip(page * perPage);
    }

    /**
     * @memberof QuestionsCtl
     * 特定问题查询
     * @api {get} /questions/:id
     * @param id { String } 问题id
     * @param fields {String} 用户需要展示的信息字段，以;隔开
     */
    async findById(ctx) {
        const {
            fields = ''
        } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics');
        ctx.body = question;
    }

    /**
     * @memberof QuestionsCtl
     * 创建问题
     * @api {post} /questions
     * @param title { String } 问题标题(required: true)
     * @param description {String} 问题描述(required: false)
     */
    async create(ctx) {
        ctx.verifyParams({
            title: {
                type: 'string',
                required: true
            },
            description: {
                type: 'string',
                required: false
            },
        });
        const question = await new Question({
            ...ctx.request.body,
            questioner: ctx.state.user._id
        }).save();
        ctx.body = question;
    }

    /**
     * @memberof QuestionsCtl
     * 更新问题
     * @api {patch} /questions/:id
     * @param id { String } 问题id
     * @param title { String } 问题标题(required: true)
     * @param description {String} 问题描述(required: false)
     */
    async update(ctx) {
        ctx.verifyParams({
            title: {
                type: 'string',
                required: false
            },
            description: {
                type: 'string',
                required: false
            },
        });
        await ctx.state.question.update(ctx.request.body);
        ctx.body = ctx.state.question;
    }

    /**
     * @memberof QuestionsCtl
     * 删除问题
     * @api {delete} /questions/:id
     * @param id { String } 问题id
     */
    async delete(ctx) {
        await Question.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

    // 检查是否存在该问题
    async checkQuestionExist(ctx, next) {
        const question = await Question.findById(ctx.params.id).select('+questioner');
        if (!question) {
            ctx.throw(404, '问题不存在');
        }
        ctx.state.question = question; // 放入state中存储
        await next();
    }

    // 检查是否有修改问题权限
    async checkQuestioner(ctx, next) {
        const {
            question
        } = ctx.state;
        if (question.questioner.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
}

module.exports = new QuestionsCtl();