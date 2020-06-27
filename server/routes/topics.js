const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/topics'
});
const {
    find,
    findById,
    create,
    update,
    checkTopicExist,
    listFollowers,
    listQuestions,
} = require('../controllers/topics');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find); // 获取话题列表

router.post('/', auth, create); // 创建话题列表

router.get('/:id', findById); // 特定话题查询

router.patch('/:id', auth, update); // 更新话题

router.get('/:id/followers', checkTopicExist, listFollowers); // 关注该话题的用户列表

router.get('/:id/questions', checkTopicExist, listQuestions); // 话题列表关联问题列表

module.exports = router;