# vrum

Game engine based on three.js

## Getting started

To run the examples or the tests:

```
yarn install
yarn serve
```

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

## Features

See [CHEATSHEET.md](CHEATSHEET.md) for example usage.

* [x] engine framework
* [x] after effects with composer
* [x] toggle fullscreen
* [x] keyboard/mouse/touch input
* [x] keyboard long pressed
* [x] warn if webgl not available
* [x] auto-resize
* [x] fade between scenes
* [x] config
* [x] change opacity of objects
* [x] tween objects around
* [x] modifiers - predefined tweens
* [x] debug stats (fps, memory, geometries, textures, points etc.)
* [x] anaglyph effect
* [x] stereo effect
* [x] adjust renderer width/height
* [x] require specific screen orientation
* [x] persist data in localStorage
* [x] sound manager
* [x] orbit controls helper
* [x] toggle wireframe
* [x] clear scene recursively
* [x] text
* [x] take screenshots
* [x] record videos
* [x] pool manager
* [x] attach object to bone
* [x] load images
* [x] load sounds
* [x] load json models
* [x] load gltf models
* [x] load glb models
* [x] load json files
* [x] load shaders
* [x] change model skin
* [x] loading done event
* [x] procedural tree
* [x] water
* [x] day/night cycle
* [x] skybox
* [x] particle system
* [x] fog
* [x] grid helper
* [x] graffiti generator (layered painting)
* [x] lightning bolt
* [x] volumetric spotlight
* [x] high score manager (backed by https://json.northpole.ro)
* [x] bundle assets
* [x] shadows
* [x] light helpers
* [x] mirror
* [x] terrain with heightmap
* [x] on screen console
* [x] forest generator
* [x] clone loaded objects instead of direct use
* [x] qr code generator
* [x] on screen controls
* [x] fine animation controls
* [x] handle timeout/interval clear on uninit scene (this.setInterval/this.setTimeout)
* [x] mesh networking
* [x] game pad controller game
* [ ] set shadowMap.width and height of all lights
* [ ] VR
* [ ] walker
* [ ] a lot of points geometry
* [ ] tween between animation weights
* [ ] generate load_assets_file.json
* [ ] attach to bone scaled
* [ ] physics
* [ ] pause rendering on blur (implement own timeout affected by rendering)
