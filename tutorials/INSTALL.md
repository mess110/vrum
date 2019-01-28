# vrum.js tutorial

These tutorials will teach you how to build an Overcooked clone. Please note,
I am only doing this for educational purposes. Also, all the code is open-source
and I am using assets made by me. We will call our game: fript

## About

vrum.js is a bunch of code which aims to help the development of cross platform
games.

Think of it as a game engine based on three.js

It started off as a card game similar to Hearthstone which I never ended up
finishing, but I extracted a game engine out of it.

I ended up using it a bunch in Ludum Dare (and not only) and made a few games:

* http://mess110.github.io/html-games/ld/040/index.html
* http://mess110.github.io/html-games/ld/ld-30-connected-worlds/
* http://mess110.github.io/html-games/pew/
* http://mess110.github.io/html-games/crossy-road/
* http://mess110.github.io/html-games/stage/

It changed quite a bit over time, looking in the source code might not be of much
help. I also feel the API got decently stable and I want to gather feedback from
different people, so I am writing this tutorial.

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
of vrum.js features.

It should look something like this:

![should look like](workspace/games/project/vrum.png)

## Create a new game

```
yarn new_game
```

When prompted, specify a name for your game. It will initially be created in
`workspace/games/` under the game name of your choosing. It contains all the
source code needed to run/develop the game.

The template from which the game is build found in `workspace/games/project`.

As mentioned previously, I will call this game fript.

The code is rather easy to understand. There is an index.html file which needs
to be opened in the browser, a game.js file which is included by index.html and
a picture.

In index.html, the main noteworthy thing is how vrum.js is imported. There are 2
ways:

* link import which aids development by using the source code from vrum repo
* vrum.min.js which is a "compiled" version of the engine

You should only use one of these methods as they do the same thing. When deploying,
you NEED to use the 2nd one. Main reasoning for this is that we don't want to deploy
all the source code of vrum.js as several files. One is enough.

Check out `yarn build` if you want to know more about how vrum.js is built.

game.js contains 2 scenes to help you get started with scene management.

```
yarn http # if you closed it
```

and open `http://127.0.0.1:8080/workspace/games/YOUR_GAME_NAME` in a browser

This is your starting template. [Lets load some assets](tutorials/ASSETS.md)
