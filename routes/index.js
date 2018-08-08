const express = require('express')
const {celebrate} = require('celebrate')
const user = require('../controller/user')

const api = express.Router()

api.get('/users', celebrate(user.index.validate), user.index.handler)

module.exports = api