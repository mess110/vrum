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
be found in package.json of vrum)
