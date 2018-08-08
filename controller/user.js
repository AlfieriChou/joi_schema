const User = require('../model/user')

module.exports = {
  index: {
    validate: User.index.validate,
    handler: (req, res) => {
      const params = req.query
      console.log('------->', params)
      res.json('hello')
    }
  }
}