const express = require('express')
const BodyParser = require('body-parser')
const celebrate = require('celebrate')
const router = require('./routes/index')
const morgan = require('morgan')

const app = express()
const port = process.env.PORT || 4000

app.use(BodyParser.urlencoded({ extended: true}))
app.use(BodyParser.json())
app.use(morgan('dev'))

app.use(express.static(__dirname + '/public'))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use('/', router)
app.use(celebrate.errors())

app.listen(port)
console.log(`listening on port ${port}`)