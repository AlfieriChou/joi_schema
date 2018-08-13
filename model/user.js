const Joi = require('joi')
const _ = require('lodash')

const props = {
  id: Joi.number().integer().description('id'),
  phone: Joi.string().description('手机号'),
  password: Joi.string().description('密码')
}

const schema = Joi.object().keys(props).description('用户信息表')

module.exports = {
  schema,
  index: {
    path: '/users',
    method: 'get',
    tags: ['users'],
    summary: '获取用户列表',
    description: '获取用户列表信息，通过不同的查询条件得到不同的查询结果',
    validate: {
      query: _.pick(props, ['phone', 'password'])
    },
    output: {
      body: Joi.object({
        code: Joi.number().description('返回标识'),
        message: Joi.string().description('接口描述'),
        data: Joi.array().items(_.omit(props, ['password'])).description('返回结果')
      }).options({
        allowUnknown: true
      }).description('返回用户列表')
    }
  },
  create: {
    path: '/users',
    method: 'post',
    tags: ['users'],
    summary: '创建用户',
    description: '创建用户信息',
    validate: {
      body: {
        phone: Joi.string().description('手机号').required(),
        password: Joi.string().description('密码').required()
      }
    }
  },
  update: {
    path: '/users/{id}',
    method: 'put',
    tags: ['users'],
    summary: '更新用户信息',
    description: '更新用户信息',
    validate: {
      params: {
        id: Joi.number().integer().description('id').required()
      },
      body: {
        phone: Joi.string().description('手机号').required(),
        password: Joi.string().description('密码').required()
      }
    }
  }
}