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
    let schema = []
    for(let index in model) {
      
      if (index === 'schema') {
        modelSchema = convert(model[index])
        for (let prop in modelSchema.properties) {
          let field = {}
          field.name = prop
          field.items = {
            'type' : modelSchema.properties[prop].type 
          }
          schema.push(field)
        }
      } else {
        content = {
          tags: model[index].tags,
          summary: model[index].summary,
          description: model[index].description
        }

        if (model[index].validate.params) {
          content.parameters = []
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
          content.parameters = []
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
          content.parameters = []
          params = convert(Joi.object(model[index].validate.body))
          let field = {}
          field.in = 'body'
          field.name = 'create'
          field.description = 'create'
          field.schema = {
            'type' : params.type,
            'required' : params.required,
            'properties' : params.properties
          }
          content.parameters.push(field)
        }

        // TODO response存在Schema格式问题
        content.responses = {
          200: {
            description: 'response success'
          }
        }

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
