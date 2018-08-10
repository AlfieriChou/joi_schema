const fs = require('fs')
const Joi = require('joi')
const convert = require('joi-to-json-schema')
const _ = require('lodash')

const generateSwagger = (modelPath = './model') => {
  // TODO 未考虑文件夹下嵌套文件夹
  const items = fs.readdirSync(modelPath)
  let methods = []
  items.forEach(item => {
    let model = require('../model/' + item)
    let schema = {}
    for(let index in model) {
      // TODO 未考虑Schema问题
      if (index === 'schema') {
        schema = convert(model[index])
        console.log('------->', schema)
      } else {
        content = {
        tags: model[index].tags,
        summary: model[index].summary,
        description: model[index].description,
        parameters: []
      }

      if (model[index].validate.params) {
        params = convert(Joi.object(model[index].validate.params))
        for (let prop in params.properties) {
          let field = {}
          field.name = prop
          field.in = 'query'
          field.description = params.properties[prop].description
          field.type = params.properties[prop].type
          field.required = false
          content.parameters.push(field)
        }
      }

      if (model[index].validate.headers) {
        params = convert(Joi.object(model[index].validate.headers))
        for (let prop in params.properties) {
          let field = {}
          field.name = prop
          field.in = 'header'
          field.description = params.properties[prop].description
          field.items = {
            'type' : params.properties[prop].type
          }
          field.required = false
          content.parameters.push(field)
        }
      }

      if (model[index].validate.body) {
        params = convert(Joi.object(model[index].validate.body))
        const required = params.required
        for (let prop in params.properties) {
          let field = {}
          field.name = prop
          field.in = 'body'
          field.description = params.properties[prop].description
          field.schema = {
            'type' : params.properties[prop].type
          }
          field.schema.items = {
            'type' : params.properties[prop].type
          }
          field.required = required.indexOf(prop) > -1 ? true : false
          content.parameters.push(field)
        }
      }

      content.responses = {"200" : convert(model[index].output.body)}

      let swaggerMethod = {}
      swaggerMethod[(model[index].method).toString()] = content
      
      let swaggerItem = {}
      swaggerItem[(model[index].path).toString()] = swaggerMethod

      methods.push(swaggerItem)
      }
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
