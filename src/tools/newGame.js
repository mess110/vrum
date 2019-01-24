#!/usr/bin/env node

// Creates a new game using workspace/games/project as a template
//
// 1. copies the template to the destination folder
// 2. copies vrum.js

const colors = require('colors');
const ncp = require('ncp').ncp;
const fs = require('fs')
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Welcome to vrum.js new game creator!')

if (!fs.existsSync('vrum.min.js')) {
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

  if (fs.existsSync(fullPath)) {
    console.error(`Game '${name}' already exists`.red)
    process.exit(1)
  }

  ncp('workspace/games/project', fullPath, function (err) {
    if (err) {
      console.error('Could not copy workspace/games/project'.red)
      process.exit(1)
    }
    ncp('vrum.min.js', `${fullPath}/vrum.min.js`, function (err) {
      if (err) {
        console.error('Could not copy vrum.min.js to game folder'.red)
        process.exit(1)
      }
      console.log(`Game '${name}' sucessfully created in '${fullPath}'`.green)
    })
  });
});
