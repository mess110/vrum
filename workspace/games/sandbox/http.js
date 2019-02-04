#!/usr/bin/env node

// Think of this as the sandbox for the app.
// It starts a webserver, after that it opens
// a browser with the game.
//
// The webserver will stay open as long as /ping.json
// is called at least once before the pingGrace runs out

const path = require('path');
const fs = require('fs');
const portfinder = require('portfinder');
const pkgOpen = require('opn-pkg');

const now = () => {
  return Math.floor(new Date() / 1000)
}

const routes = (config, request, response) => {
  if (request.url === '/ping.json') {
    console.log('received ping.json - keeping alive')
    response.writeHead(200);
    response.end('{}')
    lastPing = now()
  } else {

    var file = path.normalize(config.root + request.url);
    file = (file == config.root + '/') ? file + config.index : file;

    console.log('Trying to serve: ', file);

    const showError = (response, error) => {
      console.log(error);
      response.writeHead(500);
      response.end('Internal Server Error');
    }

    fs.exists(file, (exists) => {
      if (exists) {
        fs.stat(file, (error, stat) => {
          if (error) {
            return showError(response, error);
          }

          if (stat.isDirectory()) {
            response.writeHead(403);
            response.end('Forbidden');
          } else {
            response.writeHead(200);
            response.end(fs.readFileSync(file))
          }
        });
      } else {
        response.writeHead(404);
        response.end('Not found');
      }
    });
  }
}

const init = (config) => {
  const baseUrl = `http://localhost:${config.port}/`
  console.log(`Running at ${baseUrl}`)

  console.log('Files:')
  fs.readdirSync(config.root).forEach(file => {
    console.log(`  ${file}`);
  })
  const assetsDir = path.join(config.root, 'assets')
  if (fs.existsSync(assetsDir) && fs.lstatSync(assetsDir).isDirectory()) {
    console.log('Assets:')
    fs.readdirSync(assetsDir).forEach(file => {
      console.log(`  ${file}`);
    })
  }

  pkgOpen(baseUrl + 'index.html')

  // If we don't receive a ping within the grace period, we exit
  setInterval(() => {
    let limit = lastPing + config.pingGrace
    if (limit < now()) {
      console.log(`Last ping received at ${lastPing} which is over the ${config.pingGrace} seconds grace period. Closing`)
      process.exit(0)
    }
  }, 1000)
}

let lastPing = now()

portfinder.getPort({port: 8000, stopPort: 8999}, (err, port) => {
  let config = {
    root: path.join(__dirname),
    index: 'index.html',
    port: process.env.PORT || port,
    pingGrace: 60 // seconds server will not close after receiveing a ping
  };

  require('http').createServer((request, response) => {
    routes(config, request, response)
  }).listen(config.port, () => {
    init(config)
  })
});
