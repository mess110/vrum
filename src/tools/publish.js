#!/usr/bin/env node

const ghpages = require('gh-pages');
const colors = require('colors');
const fs = require('fs')
const path = require('path')
const common = require('./common')
const rl = require('./common').readline;

console.log('Welcome to vrum.js gh-pages publisher!'.green)

rl()
rl.question('Game full path: '.yellow, (gamePath) => {
  let dotConfigPath = path.join(gamePath, '.git', 'config')
  let vrumRepoPath = path.join(__dirname, '..', '..')

  common.existsCheck(gamePath)
  common.isDirectoryCheck(gamePath)
  common.existsCheck(dotConfigPath)

  let lines = fs.readFileSync(dotConfigPath, 'utf-8').split('\n')
  let repoUrl
  lines.forEach((line) => {
    if (line.indexOf('url = ') !== -1) {
      repoUrl = line.split(' ').pop()
    }
  })

  if (repoUrl === undefined) {
    console.error(`Could not for url in ${dotConfigPath}`)
    process.exit(10)
  }

  let indexPath = path.join(gamePath, 'index.html')
  common.checkForLinkImportDependencies(indexPath)

  common.cp(path.join(vrumRepoPath, common.distFolder, 'vrum.min.js'), path.join(gamePath, 'vrum.min.js'))

  console.log(`Found ${repoUrl}`)
  options = {
    branch: 'gh-pages',
    repo: repoUrl
  }
  ghpages.publish(gamePath, options, function(err) {
    console.log('done')
    rl.close()
  });
})
