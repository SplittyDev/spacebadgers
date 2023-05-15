const fs = require('fs')

const data = fs.readFileSync('./tools/data/verdana110.json', 'utf8')
const json = JSON.parse(data)

const items = json.map(item => item.toFixed(1)).join(',')
console.log(`const Verdana110: [f32; ${json.length}] = [\n    ${items}\n];`)
