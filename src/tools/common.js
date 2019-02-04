#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const injectHTML = (htmlPath, injectString) => {
  // TODO check for index.html
  let lines = fs.readFileSync(htmlPath, 'utf-8').split('\n')
  let lineIndex = 0
  let foundIndex = undefined
  lines.forEach((line) => {
    if (line.indexOf('</body>') !== -1) {
      foundIndex = lineIndex
    }
    lineIndex += 1
  })
  if (foundIndex !== undefined) {
    lines.splice(foundIndex, 0, injectString);
    fs.writeFileSync(htmlPath, lines.join('\n'))
    console.warn("succesfully injected")
  } else {
    console.warn("not injected")
  }
}

const cp = (srcPath, destPath) => {
  fs.writeFileSync(destPath, fs.readFileSync(srcPath))
}

const checkForLinkImportDependencies = (filePath) => {
  let lines = fs.readFileSync(filePath, 'utf-8').split('\n')
  lines.forEach((line) => {
    if (line.indexOf('<script src="/src/tools/dependencies.dev.js"></script>') !== -1) {
      if (line.indexOf('<!--') === -1) {
        console.error(`'src/tools/dependencies.dev.js' detected in '${filePath}' import 'vrum.min.js' instead`)
        process.exit(1);
      }
    }
  })
}

const existsCheck = (pathString) => {
  if (!fs.existsSync(pathString)) {
    console.error(`'${pathString}' does not exist`.red)
    process.exit(1);
  }
}

const isDirectoryCheck = (pathString) => {
  if (!fs.lstatSync(pathString).isDirectory()) {
    console.error(`'${pathString}' is not a directory`.red)
    process.exit(2);
  }
}

module.exports = {
  readline: rl,
  injectHTML: injectHTML,
  checkForLinkImportDependencies: checkForLinkImportDependencies,
  existsCheck: existsCheck,
  isDirectoryCheck: isDirectoryCheck,
  cp: cp,
  distFolder: '.',
}
