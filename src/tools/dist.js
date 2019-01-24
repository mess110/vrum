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
const readline = require('readline');
const ncp = require('ncp').ncp;
const path = require('path')
const glob = require('glob');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// The pinger is responsible for keeping the server alive
// Makes the browser call the ping.json endpoint every x seconds
const injectPinger = (htmlPath) => {
  let pinger = '<script charset="utf-8">const vrumPinger = () => { fetch("/ping.json").catch((err) => { alert("sandbox disconnected"); window.close(); }) }; vrumPinger(); setInterval(vrumPinger, 14000)</script>'

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
    lines.splice(foundIndex, 0, pinger);
    fs.writeFileSync(htmlPath, lines.join('\n'))
    console.warn("pinger succesfully injected")
  } else {
    console.warn("pinger not injected")
  }
}

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

  // copy game folder
  ncp(gamePath, destPath, (err) => {
    // copy http for exe
    ncp(vrumHttpPath, path.join(destPath, 'http.js'), (err) => {

      fs.writeFileSync(gameIndexPath, fs.readFileSync(indexPath, 'utf-8'))
      fs.writeFileSync(indexPath, fs.readFileSync(sandboxIndexPath, 'utf-8'))

      // create list of assets
      // all scripts are included as assets
      glob(path.join(destPath, '**/*'), {}, (err, assets) => {
        assets = assets.filter(x => !fs.lstatSync(x).isDirectory())
        excludedExtensions.forEach((ext) => {
          assets = assets.filter(x => !x.endsWith(ext))
        })
        assets = assets.map((e) => { return e.replace(destPath + '/', '') })

        injectPinger(indexPath)
        injectPinger(gameIndexPath)

        packageJson.name = gameName
        packageJson.pkg.assets = assets

        console.log(packageJson)

        fs.writeFileSync(path.join(destPath, 'package.json'), JSON.stringify(packageJson));
        rl.close()
      })
    })
  })
})
