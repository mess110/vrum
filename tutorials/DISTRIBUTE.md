# Distribute

Please follow [the previous tutorial](tutorials/INSTALL.md) if you want to know how
to setup the game template for development.

## About

Now that we have our game, we want other to play it, or at least test it.

There are several ways to distribute your app:

* serve it from a webserver
* build it as an executable
* deploy it to github pages

## Serve it from a webserver

Won't go over this step in too much detail, but in the end, we have some html, js
and css files. If we setup paths correctly, we can just serve all the files
from a webserver. Doesn't really matter which one.

## Build it as an executable

For this, you need the vrum repo. Go to the root of the repo and run

```
yarn dist:exe
```

Input the path to the source code. A bunch of text and warnings will fly on screen,
but the end result should be a folder called `dist` which contains different
executables for different platforms: linux, mac, windows

## Deploy it to Github Pages

For this, you need the vrum repo and the game as a git repo. Run:

```
yarn dist:web
```

Input the path to the source code. The script will check for a git repo and
deploy it to a branch called `gh-pages` which will activate auto building by Github.

Open the URL of the repo to see your game in action. If you don't know the URL, you
can find it in the github pages section of your repo settings page.

Example: [https://github.com/mess110/vrum/settings](https://github.com/mess110/vrum/settings)

gg
