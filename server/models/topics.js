const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const topicSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    name: { // 话题名称
        type: String,
        required: true
    },
    avatar_url: { // 话题图标
        type: String
    },
    introduction: { // 话题简介
        type: String,
        select: false
    },
}, {
    timestamps: true
});

module.exports = model('Topic', topicSchema);