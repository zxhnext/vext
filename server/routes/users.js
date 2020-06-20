const Router = require('koa-router')
// const jsonwebtoken = require('jsonwebtoken') // 生成token
const jwt = require('koa-jwt') // 用户认证与授权(参考自己编写的auth方法)
// koa-jwt 
// 使用详解：https://www.jianshu.com/p/794ba23e68ad
// 文档翻译： https://segmentfault.com/a/1190000009788117

const {
    checkOwner, // 确认授权(是否是自己)
    find,  // 获取用户列表
    findById,
    create,
    update,
    delete: del,
    login,
    checkLogin,
    listFollowing,
    follow,
    unfollow,
    listFollowers,
    checkUserExist,
    followTopic,
    unfollowTopic,
    listFollowingTopics,
    listQuestions,
    listLikingAnswers,
    likeAnswer,
    unlikeAnswer,
    listDislikingAnswers,
    dislikeAnswer,
    undislikeAnswer,
    listCollectingAnswers,
    collectAnswer,
    uncollectAnswer,
} = require('../controllers/users')

const {
    checkTopicExist
} = require('../controllers/topics')

const {
    checkAnswerExist
} = require('../controllers/answers')

const {
    secret
} = require('../config')

const router = new Router({
    prefix: '/users'
})

// 自己编写用户认证
// const auth = async (ctx, next) => {
//     const {
//         authorization = ''
//     } = ctx.request.header
//     const token = authorization.replace('Bearer ', '')
//     try {
//         const user = jsonwebtoken.verify(token, secret) // 是否认证
//         ctx.state.user = user
//     } catch (err) {
//         ctx.throw(401, err.message)
//     }
//     await next()
// }

const auth = jwt({
    secret
})

/* 用户信息 start */
router.get('/', find) // 获取用户列表

router.get('/:id', findById) // 获取特定用户信息

router.post('/', create) // 用户注册

router.patch('/:id', auth, checkOwner, update) // put是整体替换，patch可以更新部分数据 用户信息更新

router.delete('/:id', auth, checkOwner, del) // 用户注销

router.post('/login', login) // 用户登录

router.post('/check', auth, checkLogin) // 用户登录
/* 用户信息 end */

/* 关注用户 start */
router.get('/:id/following', listFollowing) // 用户关注人列表

router.get('/:id/followers', listFollowers) // 粉丝列表

router.put('/following/:id', auth, checkUserExist, follow) // 添加关注

router.delete('/following/:id', auth, checkUserExist, unfollow) // 取消关注
/* 关注用户 end */

/* 关注话题 start */
router.get('/:id/followingTopics', listFollowingTopics) // 获取用户关注话题

router.put('/followingTopics/:id', auth, checkTopicExist, followTopic) // 关注话题

router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic) // 取消关注话题
/* 关注话题 end */

/* 问题 start */
router.get('/:id/questions', listQuestions) // 用户问题列表
/* 问题 end */

/* 赞和踩 start */
router.get('/:id/likingAnswers', listLikingAnswers) // 赞的答案列表

router.put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer) // 点赞

router.delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer) // 取消赞

router.get('/:id/dislikingAnswers', listDislikingAnswers) // 踩的答案列表

router.put('/dislikingAnswers/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer) // 踩

router.delete('/dislikingAnswers/:id', auth, checkAnswerExist, undislikeAnswer) // 取消踩
/* 赞和踩 end */

/* 收藏答案 start */
router.get('/:id/collectingAnswers', listCollectingAnswers) // 收藏答案列表

router.put('/collectingAnswers/:id', auth, checkAnswerExist, collectAnswer) // 收藏

router.delete('/collectingAnswers/:id', auth, checkAnswerExist, uncollectAnswer) // 取消收藏
/* 收藏答案 end */
module.exports = router