const swagger = require('../common/swagger')

module.exports = {
  index: {
    handler: (req, res) => {
      const data = swagger.generateSwagger()
      res.json(data)
    }
  }
}