const Comment = require('../models/comments');

class CommentsCtl {
    /**
     * @memberof CommentsCtl
     * 获取某问题下的某答案评论列表
     * @api {get} /questions/:questionId/answers/:answerId/comments
     * @param per_page {Number} 返回几条数据
     * @param page {Number} 第几页
     * @param q {String} 关键词搜索
     * @param questionId {String} 问题id
     * @param answerId {String} 回答id
     * @param rootCommentId {String} 一级评论id
     */
    async find(ctx) {
        const {
            per_page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        const {
            questionId,
            answerId
        } = ctx.params;
        const {
            rootCommentId
        } = ctx.query;
        ctx.body = await Comment
            .find({
                content: q,
                questionId,
                answerId,
                rootCommentId
            })
            .limit(perPage).skip(page * perPage)
            .populate('commentator replyTo');
    }
    
    /**
     * @memberof CommentsCtl
     * 查看特定用户
     * @api {get} /questions/:questionId/answers/:answerId/comments/:id
     * @param id { String } 评论id
     * @param fields {String} 用户需要展示的信息字段，以;隔开
     */
    async findById(ctx) {
        const {
            fields = ''
        } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator');
        ctx.body = comment;
    }

    /**
     * @memberof CommentsCtl
     * 新建评论
     * @api {post} /questions/:questionId/answers/:answerId/comments
     * @param content {String} 内容 (required：true)
     * @param rootCommentId {String} 评论人id (required：true)
     * @param replyTo {String} 回复给哪个用户 
     */
    async create(ctx) {
        ctx.verifyParams({
            content: {
                type: 'string',
                required: true
            },
            rootCommentId: {
                type: 'string',
                required: false
            },
            replyTo: {
                type: 'string',
                required: false
            },
        });
        const commentator = ctx.state.user._id;
        const {
            questionId,
            answerId
        } = ctx.params;
        const comment = await new Comment({
            ...ctx.request.body,
            commentator,
            questionId,
            answerId
        }).save();
        ctx.body = comment;
    }

    /**
     * @memberof CommentsCtl
     * 更新评论
     * @api {patch} /questions/:questionId/answers/:answerId/comments/:id
     * @param content {String} 内容 (required：true)
     */
    async update(ctx) {
        ctx.verifyParams({
            content: {
                type: 'string',
                required: false
            },
        });
        const {
            content
        } = ctx.request.body;
        await ctx.state.comment.update({
            content
        });
        ctx.body = ctx.state.comment;
    }

    /**
     * @memberof CommentsCtl
     * 删除评论
     * @api {delete} /questions/:questionId/answers/:answerId/comments/:id
     * @param id { String } 评论id
     */
    async delete(ctx) {
        await Comment.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

    async checkCommentator(ctx, next) {
        const {
            comment
        } = ctx.state;
        if (comment.commentator.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }

    async checkCommentExist(ctx, next) {
        const comment = await Comment.findById(ctx.params.id).select('+commentator');
        if (!comment) {
            ctx.throw(404, '评论不存在');
        }
        if (ctx.params.questionId && comment.questionId.toString() !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有此评论');
        }
        if (ctx.params.answerId && comment.answerId.toString() !== ctx.params.answerId) {
            ctx.throw(404, '该答案下没有此评论');
        }
        ctx.state.comment = comment;
        await next();
    }
}

module.exports = new CommentsCtl();