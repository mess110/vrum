# vrum.js tutorial

## About

vrum.js is a bunch of code which aims to help the development of cross platform
games. Think of it as a game engine based on three.js. It started off as a card game
similar to Hearthstone which I never finished. I did however extract a game
engine out of it.

I used it in Ludum Dare (but not only) and made a few games:

* http://mess110.github.io/html-games/ld/040/index.html
* http://mess110.github.io/html-games/ld/ld-30-connected-worlds/
* http://mess110.github.io/html-games/pew/
* http://mess110.github.io/html-games/crossy-road/
* http://mess110.github.io/html-games/stage/

The engine changed quite a bit over time. Looking in the source code might not be
of much help. I also feel the API got decently stable and I want to gather feedback
from different people, so I am writing this tutorial.

I learned about game development by making crappy games. Hopefully, I learned
enough to also make good ones in the future. Here are some of the game engines
I used and learned from:

* Ogre3D
* jMonkeyEngine
* AndEngine

I also play a bunch of games. Won't list them, but I would like to talk about
Worms. Team17 made Worms. Team17 also made Overcooked. And Overcooked seems like
a good game to learn how to build.

Oh.. And the name? Think of the sound a car engine makes. vrum vrum.

## Install

"Atwood's Law: any application that can be written in JavaScript, will eventually
be written in JavaScript." And here we are. Install node.js (tested version can
be found in package.json of vrum). If you need different versions of node.js, you
can use nvm. I also recommend using yarn.

```
npm install -g yarn
git clone https://github.com/mess110/vrum.git
cd vrum
yarn install
```

This should create a folder called vrum and install node.js dependencies.

## Test

Are we ready to go? Lets check:

```
yarn http
```

Now open `http://127.0.0.1:8080/workspace/games/test/` in a decent browser.
You should see quite a chaotic scene with a log going on. Its testing a bunch
of vrum.js features. It should look something like this:

![should look like](/workspace/games/project/vrum.png)

## NewGame

Create a new game. The template from which the game is built can be found in
`workspace/games/project`.

```
yarn new_game
```

When prompted, specify a name for your game. It will initially be created in
`workspace/games/` under the game name of your choosing. It contains all the
source code needed to run/develop the game.

The code is rather easy to understand. There is an index.html file which needs
to be opened in the browser and a game.js file which is included by index.html.
In index.html, the main noteworthy thing is how vrum.js is imported.
There are 2 ways:

* load /src/tools/dependencies.dev.js
* load vrum.min.js which is a "compiled" version of all the files loaded from
/src/tools/dependencies.dev.js

You should only use one of these methods as they do the same thing. When
deploying, you NEED to use the 2nd one. Main reasoning for this is that we
don't want to deploy all the source code of vrum.js as several files.
One is enough.

```
loadVrumScripts([
  'game.js'
])
```

Makes sure all the assets are loaded in order. In the case of
dependencies.dev.js, it loads each source file in order.

Open `http://127.0.0.1:8080/workspace/games/YOUR_GAME_NAME` in a browser to
test your game.
