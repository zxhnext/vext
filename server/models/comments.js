const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;
const commentSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    content: {
        type: String,
        required: true
    },
    commentator: { // 评论人
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        select: false
    },
    questionId: { // 问题id
        type: String,
        required: true
    },
    answerId: { // 哪个答案下的
        type: String,
        required: true
    },
    rootCommentId: { // 根评论(一级评论id)id
        type: String
    },
    replyTo: { // 回复给哪个用户
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true // 设置时间戳(自动加上创建和更新时间)
});

module.exports = model('Comment', commentSchema);