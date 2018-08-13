const fs = require('fs')
const Joi = require('joi')
const convert = require('joi-to-json-schema')
const _ = require('lodash')

const generateSwagger = (modelPath = './model') => {
  // TODO 未考虑文件夹下嵌套文件夹
  const items = fs.readdirSync(modelPath)
  let methods = []
  let definitions = {}
  items.forEach(item => {
    let model = require('../model/' + item)
    item = item.replace(/\.\w+$/, '')
        let schemaName = item.slice(0, 1).toUpperCase() + item.slice(1)
    for (let index in model) {
    
      if (index === 'schema') {
        modelSchema = convert(model[index])
        let schema = {}
        schema[schemaName] = {
          'type' : 'object',
          'properties' : modelSchema.properties
        }
        definitions = _.merge(definitions, schema)
      } else {
        content = {
          tags: model[index].tags,
          summary: model[index].summary,
          description: model[index].description,
          parameters : []
        }

        if (model[index].validate.query) {
          params = convert(Joi.object(model[index].validate.query))
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

        if (model[index].validate.params) {
          params = convert(Joi.object(model[index].validate.params))
          for (let prop in params.properties) {
            let field = {}
            field.name = prop
            field.in = 'path'
            field.description = params.properties[prop].description
            field.type = params.properties[prop].type
            field.required = true
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
            field.required = true
            content.parameters.push(field)
          }
        }

        if (model[index].validate.body) {
          params = convert(Joi.object(model[index].validate.body))
          let field = {}
          field.in = 'body'
          field.name = 'body'
          field.description = model[index].description
          field.schema = {
            'type' : params.type,
            'required' : params.required,
            'properties' : params.properties
          }
          content.parameters.push(field)
        }

        content.responses = {
          200: {
            'description' : 'response success',
            'schema' : {
              'type' : 'array',
              'items': {
                $ref: `#/definitions/${schemaName}`
              }
            }
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
  swagger.definitions = definitions
  return swagger
}

module.exports = {
  generateSwagger
}
