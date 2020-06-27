const jsonwebtoken = require('jsonwebtoken') // 生成token
const User = require('../models/users')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const {
  secret
} = require('../config')

/**
 * UsersCtl定义用户信息操作
 */
class UsersCtl {
  /* 用户信息 start */
  /**
   * @memberof UsersCtl
   * 获取用户列表
   * @api {get} /users
   * @param per_page {Number} 返回几条数据
   * @param page {Number} 第几页
   * @param q {String} 关键词搜索
   */
  async find(ctx) { // 获取用户列表
    // ctx.set('Allow', 'GET, POST') // 设置响应头
    // ctx.status = 200
    const {
      per_page = 10 // 返回几条数据
    } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1; // 第几页
    const perPage = Math.max(per_page * 1, 1); // 第多少条数据
    ctx.body = await User
      .find({ // 模糊搜索，关键词搜索
        name: new RegExp(ctx.query.q)
      })
      .limit(perPage).skip(page * perPage); // 从第page * perPage条数据开始，返回perPage条
  }

  /**
   * @memberof UsersCtl
   * 查看特定用户
   * @api {get} /users/:id
   * @param id { String } 用户id
   * @param fields {String} 用户需要展示的信息字段，以;隔开
   */
  async findById(ctx) {
    const {
      fields = '' // 用户需要展示的信息字段
    } = ctx.query; // 获取参数
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const populateStr = fields.split(';').filter(f => f).map(f => {
      if (f === 'employments') {
        return 'employments.company employments.job';
      }
      if (f === 'educations') {
        return 'educations.school educations.major';
      }
      return f;
    }).join(' ');
    const user = await User.findById(ctx.params.id).select(selectFields) // 使传入的参数变为显示
      .populate(populateStr) // 数据表中引用的类型需要加populate
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  /**
   * @memberof UsersCtl
   * 注册接口
   * @api {post} /users
   * @param name {String} 用户名 (required：true)
   * @param password {String} 密码 (required：true)
   */
  async create(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })
    const {
      name
    } = ctx.request.body
    const repeatedUser = await User.findOne({
      name
    })
    if (repeatedUser) {
      ctx.throw(409, '该用户已存在')
    }
    const user = await new User(ctx.request.body).save()
    ctx.status = 200
    ctx.body = user
  }

  /**
   * @memberof UsersCtl
   * 修改用户信息
   * @api {patch} /users/:id
   * @param id { String } 用户id
   * @param name {String} 用户名  (required：false)
   * @param password {String} 密码 (required：false)
   * @param ...参见数据表
   */
  async update(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false
      },
      password: {
        type: 'string',
        required: false
      },
      avatar_url: {
        type: 'string',
        required: false
      },
      gender: {
        type: 'string',
        required: false
      },
      headline: {
        type: 'string',
        required: false
      },
      locations: {
        type: 'array',
        itemType: 'string', // 数组中的每一项为string类型
        required: false
      },
      business: {
        type: 'string',
        required: false
      },
      employments: {
        type: 'array',
        itemType: 'object',
        required: false
      },
      educations: {
        type: 'array',
        itemType: 'object',
        required: false
      },
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  /**
   * @memberof UsersCtl
   * 检测用户是否登录
   * @api {post} /users/check
   */
  async checkLogin(ctx) {
    console.log('ctx.state.user', ctx.state.user)
    try {
      const user = ctx.state.user
      const {
        _id,
        name
      } = user
      const token = jsonwebtoken.sign({ // 生成签名(token)
        _id,
        name
      }, secret, {
        expiresIn: '5d' // 过期时间，1天
      })

      ctx.cookies.set('token', token, {
        domain: ".project.com"
      })

    
      ctx.body = {
        token,
        user
      }

    } catch (e) {
        ctx.throw(401, '用户未登录')
    }
  }

  /**
   * @memberof UsersCtl
   * 用户注销
   * @api {delete} /:id
   * @param id { String } 用户id
   */
  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.status = 204
  }

  /**
   * @memberof UsersCtl
   * 登录接口
   * @api {post} /login
   * @param name {String} 用户名  (required：true)
   * @param password {String} 密码 (required：true)
   */
  async login(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) ctx.throw(401, '用户名或密码不正确')
    const {
      _id,
      name
    } = user
    const token = jsonwebtoken.sign({ // 生成签名(token)
      _id,
      name
    }, secret, {
      expiresIn: '5d' // 过期时间，1天
    })

    ctx.cookies.set('token', token)
    ctx.body = {
      token,
      user
    }
  }
  /* 用户信息 end */

  /* 关注用户 start */
  /**
   * @memberof UsersCtl
   * 关注的用户列表
   * @api {get} /users/:id/following
   * @param id { String } 用户id
   */
  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate('following'); // populate()根据following字段里的id，获取该id具体信息(Schema.Types.ObjectId)
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = user.following;
  }

  /**
   * @memberof UsersCtl
   * 关注用户
   * @api {put} /users/following/:id
   * @param id { String } 用户id
   */
  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204; // 代表成功了但是并没有返回
  }

  /**
   * @memberof UsersCtl
   * 取消关注用户
   * @api {delete} /users/following/:id
   * @param id { String } 用户id
   */
  async unfollow(ctx) { // 取消关注
    const me = await User.findById(ctx.state.user._id).select('+following');
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }

  /**
   * @memberof UsersCtl
   * 获取粉丝列表
   * @api {get} /users/:id/followers
   * @param id { String } 用户id
   */
  async listFollowers(ctx) {
    const users = await User.find({
      following: ctx.params.id
    });
    ctx.body = users;
  }
  /* 关注用户 end */

  /* 关注话题 start */
  /**
   * @memberof UsersCtl
   * 关注的话题列表
   * @api {get} /users/:id/followingTopics
   * @param id { String } 用户id
   */
  async listFollowingTopics(ctx) {
    const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics');
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = user.followingTopics;
  }

  /**
   * @memberof UsersCtl
   * 关注话题
   * @api {put} /users/followingTopics/:id
   * @param id { String } 话题id
   */
  async followTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopics');
    if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }

  /**
   * @memberof UsersCtl
   * 取消关注话题
   * @api {delete} /users/followingTopics/:id
   * @param id { String } 话题id
   */
  async unfollowTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopics');
    const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  /* 关注话题 end */

  /* 问题部分 start */
  /**
   * @memberof UsersCtl
   * 用户问题列表
   * @api {get} /users/:id/questions
   * @param id { String } 用户id
   */
  async listQuestions(ctx) {
    const questions = await Question.find({
      questioner: ctx.params.id
    });
    ctx.body = questions;
  }
  /* 问题部分 end */

  /* 赞和踩 start */
  /**
   * @memberof UsersCtl
   * 喜欢的答案列表
   * @api {get} /users/:id/likingAnswers
   * @param id { String } 用户id
   */
  async listLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers')
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = user.likingAnswers;
  }

  /**
   * @memberof UsersCtl
   * 点赞答案
   * @api {put} /users/likingAnswers/:id
   * @param id { String } 答案id
   */
  async likeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
    if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id);
      me.save();
      await Answer.findByIdAndUpdate(ctx.params.id, {
        $inc: { // 增加或减少
          voteCount: 1 // 增加投票数
        }
      });
    }
    ctx.status = 204;
    await next();
  }

  /**
   * @memberof UsersCtl
   * 取消赞
   * @api {put} /users/likingAnswers/:id
   * @param id { String } 答案id
   */
  async unlikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
    const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.likingAnswers.splice(index, 1);
      me.save();
      await Answer.findByIdAndUpdate(ctx.params.id, {
        $inc: {
          voteCount: -1
        }
      });
    }
    ctx.status = 204;
  }

  /**
   * @memberof UsersCtl
   * 踩过的答案列表
   * @api {get} /users/:id/dislikingAnswers
   * @param id { String } 用户id
   */
  async listDislikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers');
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = user.dislikingAnswers;
  }

  /**
   * @memberof UsersCtl
   * 踩
   * @api {put} /users/dislikingAnswers/:id
   * @param id { String } 答案id
   */
  async dislikeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
    if (!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.dislikingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }

  /**
   * @memberof UsersCtl
   * 取消踩
   * @api {delete} /users/dislikingAnswers/:id
   * @param id { String } 答案id
   */
  async undislikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
    const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.dislikingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  /* 赞和踩 end */

  /* 收藏答案 start */
  /**
   * @memberof UsersCtl
   * 收藏的答案列表
   * @api {get} /users/:id/collectingAnswers
   * @param id { String } 用户id
   */
  async listCollectingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers');
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = user.collectingAnswers;
  }

  /**
   * @memberof UsersCtl
   * 收藏
   * @api {put} /users/collectingAnswers/:id
   * @param id { String } 答案id
   */
  async collectAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
    if (!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.collectingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }

  /**
   * @memberof UsersCtl
   * 取消收藏
   * @api {delete} /users/collectingAnswers/:id
   * @param id { String } 答案id
   */
  async uncollectAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
    const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.collectingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  /* 收藏答案 end */

  /**
   * @memberof UsersCtl
   * 确认授权(是否是自己)
   */
  async checkOwner(ctx, next) {
    // koa-jwt 默认将user_id保存在ctx.state中
    console.log('ctx.state.user_id', ctx.state.user._id)
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限');
    }
    await next()
  }

  /**
   * @memberof UsersCtl
   * 检查用户是否存在
   */
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    await next();
  }
}

module.exports = new UsersCtl()
