#!/usr/bin/env node

const colors = require('colors');

console.log(`
Example usage:

  yarn [command]

Commands:

  * http      - starts a http server
  * https     - starts a https server. requires self signed certificates
  * genkey    - generates https self signed certificates
  * new_game  - create a new game
`)
