# Cheatsheet

## Distribute the app

```
yarn dist:exe # for linux/mac/windows
yarn dist:web # for gh-pages publish
```

## Create a new game from the template

To make your own game in a new folder with vrum.js packed:

```
yarn new_game
```

## Exporting from Blender

To export to glTF, the recommended format by three.js, you need to install the
[glTF-Blender-Exporter](https://github.com/KhronosGroup/glTF-Blender-Exporter)
blender addon.

* [Download the exporter](https://github.com/KhronosGroup/glTF-Blender-Exporter/archive/master.zip)
* unzip `scripts/addons/io_scene_gltf2` to `~/.config/blender/VERSION/scripts/addons/`
* enable the addon from Blender User Preferences
* export to glb as it packs all the resources in 1 file

## Warn if webgl not available

Happens automatically with the help of [src/extras/PolyfillRenderer.js](src/extras/PolyfillRenderer.js)

## Config

[src/engine/Config.js](src/engine/Config.js)

## Adjust render width/height

[RenderManager.setWidthHeight](RenderManager.setWidthHeight)

## QR Code

```
new QRCode("qrcode", { text: "hello world", width: 128, height: 128 });
```

## Highscores

Each game has its own user/pass which currently is stored client side in an insecure
way. It is "safe" to store it like this because the high scores for mini games
are not that important when prototyping the game.

After you register and api_key and secret you can `HighScoreManager.addScore` or `HighScoreManager.getScores(20)`

See [src/extras/HighScoreManager.js](src/extras/HighScoreManager.js) for more info.

## Mesh Networking

See [src/extras/MeshNetwork.js](src/extras/MeshNetwork.js) for more info.

## Virtual Joystick

See [src/extras/VirtualController.js](src/extras/VirtualController.js) for more info.