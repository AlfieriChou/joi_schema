const User = require('../model/user')

module.exports = {
  index: {
    validate: User.index.validate,
    handler: (req, res) => {
      const params = req.query
      console.log('------->', params)
      res.json('hello')
    }
  },
  create: {
    validate: User.create.validate,
    handler: (req, res) => {
      const params = req.body
      console.log('------>', params)
      res.json('world')
    }
  }
}