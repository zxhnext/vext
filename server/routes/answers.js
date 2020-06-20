const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/questions/:questionId/answers' // 二级嵌套
});
const {
    find,
    findById,
    create,
    update,
    delete: del,
    checkAnswerExist,
    checkAnswerer,
} = require('../controllers/answers');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find); // 获取该问题下的答案列表

router.post('/', auth, create); // 新建答案

router.get('/:id', checkAnswerExist, findById); // 查询特定答案

router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update); // 更新答案

router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del); // 删除答案

module.exports = router;