const express = require('express')
const {celebrate} = require('celebrate')
const user = require('../controller/user')
const swagger = require('../controller/swagger')

const api = express.Router()

api.get('/users', celebrate(user.index.validate), user.index.handler)
api.post('/users', celebrate(user.create.validate), user.create.handler)

api.get('/swagger.json', swagger.index.handler)

module.exports = api