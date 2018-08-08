const Joi = require('joi')
const _ = require('lodash')

const props = {
  id: Joi.number().integer().description('id'),
  phone: Joi.string().description('手机号'),
  password: Joi.string().description('密码')
}

module.exports = {
  index: {
    path: '/users',
    method: 'get',
    tags: ['users'],
    summary: '获取用户列表',
    description: `获取用户列表信息，通过不同的查询条件得到不同的查询结果`,
    validate: {
      params: {
        phone: Joi.string().description('手机号')
      }
    },
    output: {
      '200': {
        body: Joi.object({
          code: Joi.number().description('返回标识'),
          message: Joi.string().description('接口描述'),
          data: Joi.array().items(_.omit(props, ['password'])).description('返回结果')
        }).options({
          allowUnknown: true
        }).description('返回用户列表')
      }
    }
  }
}