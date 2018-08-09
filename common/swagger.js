const fs = require('fs')
const Joi = require('joi')
const convert = require('joi-to-json-schema')
const j2s = require('joi-to-swagger')
const _ = require('lodash')

const modelList = (modelPath = './model') => {
  const items = fs.readdirSync(modelPath)
  let reg = /\.\w+$/
  let method = []
  items.map(item => {
    item = item.toString()
    item = item.replace(reg, '')
    let model = require('../model/' + item)
    for(let x in model) {
      content = {
        tags: model[x].tags,
        summary: model[x].summary,
        description: model[x].description
      }
      if (model[x].validate.params) {
        params = j2s(Joi.object(model[x].validate.params)).swagger
        content.parameters = params
      }
      if (model[x].validate.headers) {
        headers = j2s(Joi.object(model[x].validate.headers)).swagger
        content.headers = headers
      }
      if (model[x].validate.body) {
        body = j2s(Joi.object(model[x].validate.body)).swagger
        content.body = body
      }
      content.responses = {'200': convert(model[x].output.body)}

      let swaggerMethod = {}
      swaggerMethod[(model[x].method).toString()] = content
      
      let swaggerItem = {}
      swaggerItem[(model[x].path).toString()] = swaggerMethod
      method.push(swaggerItem)
    }
  })
  return method
}

const mergePath = () => {
  const method = modelList()
  if (!Array.isArray(method)) throw new Error('method mast be array!!!')
  let mergeMethod = {}
  for (let i = 0; i < method.length; ++i) {
    mergeMethod = _.merge(mergeMethod, method[i])
  }
  return mergeMethod
}

const generateSwagger = () => {
  let swagger = {}
  swagger.swagger = '2.0'
  swagger.info = {
    'title': 'API document',
    'version': 'v3'
  }
  const paths = mergePath()
  if (typeof paths !== 'object') throw new Error('paths mast be object!!!')
  swagger.paths = paths
  return swagger
}

module.exports = {
  generateSwagger
}
