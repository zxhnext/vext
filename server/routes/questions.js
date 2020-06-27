const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/questions'
});
const {
    find,
    findById,
    create,
    update,
    delete: del,
    checkQuestionExist,
    checkQuestioner,
} = require('../controllers/questions');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find); // 获取问题列表

router.post('/', auth, create); // 创建问题

router.get('/:id', checkQuestionExist, findById); // 查询特定问题

router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update); // 更新问题

router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del); // 删除问题

module.exports = router;