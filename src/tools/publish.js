#!/usr/bin/env node

const ghpages = require('gh-pages');
const colors = require('colors');
const fs = require('fs')
const rl = require('./common').readline;
const path = require('path')
const checkForLinkImportDependencies = require('./common').checkForLinkImportDependencies

console.log('Welcome to vrum.js gh-pages publisher!'.green)
// TODO: which folder
// which repo, get url

let repoRoot = ''
let repoUrl = '' // TODO: get from .git/config

let indexPath = path.join(repoRoot, 'index.html')
checkForLinkImportDependencies(indexPath)

options = {
  branch: 'gh-pages',
  repo: 'https://example.com/other/repo.git'
}
ghpages.publish(repoRoot, options, function(err) {
  console.log('done')
});
