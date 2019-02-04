#!/usr/bin/env node

// Handles building of vrum.js and vrum.min.js
//
// Each script tag in 'src/tools/dependencies.dev.js' gets read and appended
// to a file. That file is then minified

const colors = require('colors');
const concat = require('concat-files');
const fs = require('fs')
const UglifyJS = require('uglify-es');
const path = require('path')
const common = require('./common')

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename)
  const fileSizeInBytes = stats.size
  return (fileSizeInBytes / 1000000).toFixed(1)
}

function printFileSize(filename) {
  var output = "success ".green + filename + " (" + getFilesizeInBytes(filename) + " MB)"
  console.log(output)
}

console.log("Building vrum.js and vrum.min.js")

var dependencies = fs.readFileSync('src/tools/dependencies.dev.js', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .filter((e) => e.startsWith('  "'))
  .map((e) => e.substr(3).slice(0, -2))
  .map((e) => {
    if (e[0] == '/') {
      return e.substr(1);
    } else {
      return e.substr(9)
    }
  })
dependencies.splice(0, 0, 'src/tools/dependencies.dist.js')

if (!fs.existsSync(common.distFolder)){
    fs.mkdirSync(common.distFolder);
}
var outputPath = path.join(common.distFolder, 'vrum.js')
var outputPathMin = path.join(common.distFolder, 'vrum.min.js')

concat(dependencies, outputPath, (err) => {
  if (err) throw err

  var single = fs.readFileSync(outputPath, 'utf-8')

  printFileSize(outputPath)

  var file = UglifyJS.minify(single, {})
  fs.writeFileSync(outputPathMin, file.code)

  printFileSize(outputPathMin)
  process.exit(0)
})
