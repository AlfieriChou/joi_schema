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
