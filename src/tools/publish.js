#!/usr/bin/env node

const ghpages = require('gh-pages');
const colors = require('colors');
const fs = require('fs')
const path = require('path')
const common = require('./common')
const readline = require('./common').readline;
const open = require('open');

const argv = process.argv.slice(2)

console.log('Welcome to vrum.js gh-pages publisher!'.green)

const repoUrl2GhPagesUrl = (repoUrl) => {
  let username
  let repoName

  if (repoUrl.startsWith('git@')) {
    let urlParts = repoUrl.split(':')[1].split('/')
    username = urlParts[0]
    repoName = urlParts[1].split('.')
    repoName.splice(-1, 1)
    repoName = repoName[0]
  } else {
    // https urls
    let urlParts = repoUrl.split('.')
    urlParts.pop()
    urlParts = urlParts[1].split('/')
    username = urlParts[1]
    repoName = urlParts[2]
  }
  return `https://${username}.github.io/${repoName}`
}

const publish = (gamePath, callback) => {
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
    repo: repoUrl,
    message: 'Auto-generated commit'
  }
  ghpages.publish(gamePath, options, function(err) {
    let publishUrl = repoUrl2GhPagesUrl(repoUrl)
    console.log(`Done. Opening ${publishUrl}`.green)
    open(publishUrl);
    callback()
  });
}

if (argv.length == 0) {
  const rl = readline()
  rl.question('Game full path: '.yellow, (gamePath) => {
    publish(gamePath, () => {
      rl.close()
    })
  })
} else {
  publish(argv[0], () => {})
}
