#!/usr/bin/env node

// Creates a new game using workspace/games/project as a template
//
// 1. copies the template to the destination folder
// 2. copies vrum.js

const colors = require('colors');
const ncp = require('ncp').ncp;
const fs = require('fs')
const common = require('./common')
const rl = require('./common').readline
const path = require('path')

console.log('Welcome to vrum.js new game creator!')

let vrumMinJsPath = path.join(common.distFolder, 'vrum.min.js')

if (!fs.existsSync(vrumMinJsPath)) {
  console.error(`vrum.min.js is missing. Run 'yarn build' first`.red)
  process.exit(1)
}

rl.question('Game name: '.yellow, (name) => {
  rl.close();

  var targetDir = 'workspace/games/'
  var fullPath = `${targetDir}${name}`

  if (name == '' || name == undefined || name == null || fullPath === targetDir) {
    console.error('Name missing'.red)
    process.exit(1)
  }

  if (name.search(/^[a-zA-Z0-9-_]+$/) == -1) {
    console.error('Invalid name. Only alpha, numeric, - and _ characters allowed')
    process.exit(1)
  }

  if (fs.existsSync(fullPath)) {
    console.error(`Game '${name}' already exists`.red)
    process.exit(1)
  }

  ncp('workspace/games/project', fullPath, function (err) {
    if (err) {
      console.error('Could not copy workspace/games/project'.red)
      process.exit(1)
    }
    common.cp(vrumMinJsPath, `${fullPath}/vrum.min.js`)
    console.log(`Game '${name}' sucessfully created in '${fullPath}'`.green)
  });
});
