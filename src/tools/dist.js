#!/usr/bin/env node

// Prepare a game for distribution
//
// 1. copies the game to a tmp directory
// 2. renames index.html to index_game.html
// 3. copies vrum-http.js to the tmp directory
// 4. copies sandbox index.html to the tmp directory
// 5. creates a list of assets (*.html, *.css, *.js, assets etc)
// 6. injects the pinger
// 7. sets app name and assets in package.json
// 8. writes the package.json in the tmp directory
//
// The actual packaging happens with the help of the newly created package.json
// See `yarn build` for more info

const colors = require('colors');
const fs = require('fs')
const ncp = require('ncp').ncp;
const path = require('path')
const glob = require('glob');
const rl = require('./common').readline
const injectHTML = require('./common').injectHTML
const checkForLinkImportDependencies = require('./common').checkForLinkImportDependencies
const cp = require('./common').cp

let packageJson = {
  "name": "vrum",
  "version": "1.0.0",
  "bin": "http.js",
  "scripts": {
    "postinstall": "pkg . --targets=node10-linux-x64,node10-macos-x64,node10-win-x64 --out-path=../dist/"
  },
  "pkg": {
    "assets": [],
    "scripts": []
  },
  "dependencies": {
    "opn-pkg": "^1.0.5",
    "pkg": "^4.3.7",
    "http-server": "^0.11.1",
    "portfinder": "^1.0.20",
  }
}
const excludedExtensions = [
  '.blend', '.blend1', '.blend2', '.blend3', '.blend4', '.blend5',
  '.xcf'
]

console.log('Welcome to vrum.js game distributor!'.green)

rl.question('Game full path: '.yellow, (gamePath) => {
  let gameName = gamePath.split('/')[gamePath.split('/').length-1]
  let repoPath = path.join(__dirname, '..', '..')
  let destPath = path.join(repoPath, 'tmp')
  let sandboxPath = path.join(repoPath, 'workspace', 'games', 'sandbox')
  let vrumHttpPath = path.join(sandboxPath, 'http.js')
  let sandboxIndexPath = path.join(sandboxPath, 'index.html')
  let indexPath = path.join(destPath, 'index.html')
  let gameIndexPath = path.join(destPath, 'index_game.html')

  if (!fs.existsSync(gamePath)) {
    console.error(`'${gamePath}' does not exist`.red)
    rl.close()
    process.exit(1);
  } else if (!fs.lstatSync(gamePath).isDirectory()) {
    console.error(`'${gamePath}' is not a directory`.red)
    rl.close()
    process.exit(1);
  }

  console.log(`cp gamePath destPath`)
  ncp(gamePath, destPath, (err) => {

    console.log('cp vrum.js destPath')
    cp(path.join(repoPath, 'vrum.min.js'), path.join(destPath, 'vrum.min.js'))

    console.log('cp sandbox/http.js destPath')
    cp(vrumHttpPath, path.join(destPath, 'http.js'))

    checkForLinkImportDependencies(indexPath)

    console.log('cp index.html game_index.html')
    cp(indexPath, gameIndexPath)

    console.log('cp sandbox/index.html index.html')
    cp(sandboxIndexPath, indexPath)

    // all scripts are included as assets
    console.log('creating scripts and assets list')
    glob(path.join(destPath, '**/*'), {}, (err, assets) => {
      console.log('excluding directories')
      assets = assets.filter(x => !fs.lstatSync(x).isDirectory())

      console.log('excluding invalid extensions')
      excludedExtensions.forEach((ext) => {
        assets = assets.filter(x => !x.endsWith(ext))
      })

      console.log('removing absolute path')
      assets = assets.map((e) => { return e.replace(destPath + '/', '') })

      console.log('injecting pinger')
      let pinger = '<script charset="utf-8">Utils.initSandboxPinger()</script>'
      injectHTML(indexPath, pinger)
      injectHTML(gameIndexPath, pinger)

      console.log('injecting popStarter')
      let popStater = '<script charset="utf-8">Utils.initPopStateReload()</script>'
      injectHTML(gameIndexPath, popStater)

      packageJson.name = gameName
      packageJson.pkg.assets = assets

      console.log(packageJson)

      console.log('writing package.json')
      fs.writeFileSync(path.join(destPath, 'package.json'), JSON.stringify(packageJson));
      rl.close()
    })
  })
})
