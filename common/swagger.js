const fs = require('fs')
function getAllDirs(modelPath = '../model'){
  const items = fs.readdirSync(modelPath)
  let reg = /\.\w+$/
  items.map(item => {
    item = item.toString()
    item = item.replace(reg, '')
    let model = require('../model/' + item)
    console.log('------>', model)
    console.log('------->', item)
  })
  return items
}

console.log('------->', getAllDirs())