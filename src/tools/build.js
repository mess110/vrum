#!/usr/bin/env node

var concat = require('concat-files');
var fs = require('fs')
var UglifyJS = require('uglify-es');

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename)
  const fileSizeInBytes = stats.size
  return (fileSizeInBytes / 1000000).toFixed(1)
}

function printFileSize(filename) {
  console.log("Built " + filename + " (" + getFilesizeInBytes(filename) + " MB)")
}

console.log("Building vrum.js and vrum.min.js")

var dependencies = fs.readFileSync('workspace/dependencies.html', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((e) => e.replace('<script src="', ''))
  .map((e) => e.replace('"></script>', ''))
  .map((e) => {
    if (e[0] == '/') {
      return e.substr(1);
    } else {
      return e.substr(9)
    }
  })

var outputPath = 'vrum.js'
var outputPathMin = 'vrum.min.js'

concat(dependencies, outputPath, (err) => {
  if (err) throw err

  var single = fs.readFileSync(outputPath, 'utf-8')

  printFileSize(outputPath)

  var file = UglifyJS.minify(single, {})
  fs.writeFileSync(outputPathMin, file.code)

  printFileSize(outputPathMin)
})
