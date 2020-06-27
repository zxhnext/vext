const Answer = require('../models/answers');

class AnswersCtl {
    /**
     * @memberof AnswersCtl
     * 获取答案列表
     * @api {get} /questions/:questionId/answers
     * @param per_page {Number} 返回几条数据
     * @param page {Number} 第几页
     * @param q {String} 关键词搜索
     * @param questionId {String} 问题id
     */
    async find(ctx) {
        const {
            per_page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        ctx.body = await Answer
            .find({
                content: q,
                questionId: ctx.params.questionId
            })
            .limit(perPage).skip(page * perPage);
    }
    
    /**
     * @memberof AnswersCtl
     * 特定答案查询
     * @api {get} /questions/:questionId/answers/:id
     * @param id { String } 答案id
     * @param fields {String} 用户需要展示的信息字段，以;隔开
     */
    async findById(ctx) {
        const {
            fields = ''
        } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer');
        ctx.body = answer;
    }

    /**
     * @memberof AnswersCtl
     * 创建答案
     * @api {post} /questions/:questionId/answers
     * @param content { String } 答案内容
     */
    async create(ctx) {
        ctx.verifyParams({
            content: {
                type: 'string',
                required: true
            },
        });
        const answerer = ctx.state.user._id;
        const {
            questionId
        } = ctx.params;
        const answer = await new Answer({
            ...ctx.request.body,
            answerer,
            questionId
        }).save();
        ctx.body = answer;
    }

    /**
     * @memberof AnswersCtl
     * 更新答案
     * @api {patch} /questions/:questionId/answers/:id
     * @param content { String } 答案内容
     * @param id { String } 答案id
     */
    async update(ctx) {
        ctx.verifyParams({
            content: {
                type: 'string',
                required: false
            },
        });
        await ctx.state.answer.update(ctx.request.body);
        ctx.body = ctx.state.answer;
    }

    /**
     * @memberof AnswersCtl
     * 删除
     * @api {delete} /questions/:questionId/answers/:id
     * @param id { String } 答案id
     */
    async delete(ctx) {
        await Answer.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

    async checkAnswerer(ctx, next) {
        const {
            answer
        } = ctx.state;
        if (answer.answerer.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }

    async checkAnswerExist(ctx, next) {
        const answer = await Answer.findById(ctx.params.id).select('+answerer');
        if (!answer) {
            ctx.throw(404, '答案不存在');
        }
        // 只有删改查答案时候检查此逻辑，赞、踩答案时候不检查
        if (ctx.params.questionId && ctx.params.questionId !== answer.questionId) {
            ctx.throw(404, '该问题下没有此答案');
        }
        ctx.state.answer = answer;
        await next();
    }
}

module.exports = new AnswersCtl();