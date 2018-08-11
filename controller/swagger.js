const swagger = require('../common/swagger')

module.exports = {
  index: {
    handler: (req, res) => {
      const data = swagger.generateSwagger()
      res.json(data)
    }
  },
  doc: {
    handler: (req, res) => {
      res.render('swagger/index.html', { url: '/swagger.json' })
    }
  }
}