const Joi = require('joi')
const _ = require('lodash')

const props = {
  id: Joi.number().integer().description('id'),
  tag_name: Joi.string().description('标签名'),
  description: Joi.string().description('标签描述')
}

const schema = Joi.object().keys(props).description('标签信息表')

module.exports = {
  schema,
  index: {
    path: '/tags',
    method: 'get',
    tags: ['tags'],
    summary: '获取标签列表',
    description: '获取标签列表信息，通过不同的查询条件得到不同的查询结果',
    validate: {
      query: _.pick(props, ['tag_name'])
    },
    output: {
      body: Joi.object({
        code: Joi.number().description('返回标识'),
        message: Joi.string().description('接口描述'),
        data: Joi.array().items(_.omit(props)).description('返回结果')
      }).options({
        allowUnknown: true
      }).description('返回标签列表')
    }
  },
  create: {
    path: '/tags',
    method: 'post',
    tags: ['tags'],
    summary: '创建标签',
    description: '创建标签信息',
    validate: {
      body: {
        tag_name: Joi.string().description('手机号').required(),
        description: Joi.string().description('密码')
      }
    }
  },
  update: {
    path: '/tags/{id}',
    method: 'put',
    tags: ['tags'],
    summary: '更新标签信息',
    description: '更新标签信息',
    validate: {
      params: {
        id: Joi.number().integer().description('id').required()
      },
      body: {
        tag_name: Joi.string().description('标签名').required(),
        description: Joi.string().description('标签描述')
      }
    }
  }
}