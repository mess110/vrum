#!/usr/bin/env node

const ghpages = require('gh-pages');
const colors = require('colors');
const fs = require('fs')
const readline = require('readline');
const path = require('path')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// TODO: which folder
// which repo, get url

let repoRoot = ''
let repoUrl = '' // TODO: get from .git/config

options = {
  branch: 'gh-pages',
  repo: 'https://example.com/other/repo.git'
}
ghpages.publish(repoRoot, options, function(err) {
  console.log('done')
});
