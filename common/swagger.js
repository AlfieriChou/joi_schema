const fs = require('fs')
function getAllDirs(modelPath = '../model'){
  const items = fs.readdirSync(modelPath)
  // let reg = /\.\w+$/
  items.map(item => {
    // item = item.toString()
    // item = item.replace(reg, '')
    let model = require('../model/' + item)
    let result
    for(let x in model) {
      console.log('----->', x)
      result = {
        path: model[x].path,
        method: model[x].method
      }
      console.log('--------result', result)
    }
    console.log('------>', model)
    console.log('------->', item)
  })
  return items
}

console.log('------->', getAllDirs())