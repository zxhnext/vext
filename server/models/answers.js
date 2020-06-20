const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;
const answerSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    content: { // 内容
        type: String,
        required: true
    },
    answerer: { // 回答者
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        select: false
    },
    questionId: { // 从属哪个问题
        type: String,
        required: true
    },
    voteCount: { // 投票数
        type: Number,
        required: true,
        default: 0
    },
}, {
    timestamps: true
});

module.exports = model('Answer', answerSchema);