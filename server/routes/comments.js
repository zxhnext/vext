const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/questions/:questionId/answers/:answerId/comments' // 三级嵌套
});
const {
    find,
    findById,
    create,
    update,
    delete: del,
    checkCommentExist,
    checkCommentator,
} = require('../controllers/comments');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find); // 获取某问题下的某答案评论列表

router.post('/', auth, create); // 写评论

router.get('/:id', checkCommentExist, findById); // 查找某条评论

router.patch('/:id', auth, checkCommentExist, checkCommentator, update); // 更新评论

router.delete('/:id', auth, checkCommentExist, checkCommentator, del); // 删除评论

module.exports = router;