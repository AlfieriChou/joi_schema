const fs = require('fs')
const Joi = require('joi')
const convert = require('joi-to-json-schema')
const j2s = require('joi-to-swagger')
const _ = require('lodash')

const generateSwagger = (modelPath = './model') => {
  const items = fs.readdirSync(modelPath)
  let methods = []
  items.forEach(item => {
    let model = require('../model/' + item)
    for(let index in model) {
      content = {
        tags: model[index].tags,
        summary: model[index].summary,
        description: model[index].description
      }
      if (model[index].validate.params) {
        params = j2s(Joi.object(model[index].validate.params)).swagger
        content.parameters = params
      }
      if (model[index].validate.headers) {
        headers = j2s(Joi.object(model[index].validate.headers)).swagger
        content.headers = headers
      }
      if (model[index].validate.body) {
        body = j2s(Joi.object(model[index].validate.body)).swagger
        content.body = body
      }
      content.responses = {'200': convert(model[index].output.body)}

      let swaggerMethod = {}
      swaggerMethod[(model[index].method).toString()] = content
      
      let swaggerItem = {}
      swaggerItem[(model[index].path).toString()] = swaggerMethod

      methods.push(swaggerItem)
    }
  })

  let mergeMethod = {}
  for (let i = 0; i < methods.length; ++i) {
    mergeMethod = _.merge(mergeMethod, methods[i])
  }

  let swagger = {}
  swagger.swagger = '2.0'
  swagger.info = {
    'title': 'API document',
    'version': 'v3'
  }
  swagger.paths = mergeMethod
  return swagger
}

module.exports = {
  generateSwagger
}
