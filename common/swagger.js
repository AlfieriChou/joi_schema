const fs = require('fs')
const Joi = require('joi')
const convert = require('joi-to-json-schema')
const j2s = require('joi-to-swagger')

const getAllDirs = (modelPath = '../model') => {
  const items = fs.readdirSync(modelPath)
  // let reg = /\.\w+$/
  items.map(item => {
    // item = item.toString()
    // item = item.replace(reg, '')
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
      // console.log('--------content', content)
      let swaggerMethod = {}
      swaggerMethod[(model[x].method).toString()] = content
      let swaggerItem = {}
      swaggerItem[(model[x].path).toString()] = swaggerMethod
      console.log('----'+model[x].method+'---->', swaggerItem)
      // console.log('----path----', swaggerMethod)
    }
    // console.log('------->', model)
    // console.log('------->', item)
  })
  return items
}

console.log('------->', getAllDirs())