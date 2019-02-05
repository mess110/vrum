# ![vrum.js icon](workspace/games/project/assets/favicon.ico) vrum

Game engine based on three.js

```
yarn install
yarn help
yarn http
```

## Tutorial

<!--ts-->
   * [About](tutorials/INSTALL.md#About)
   * [Install](tutorials/INSTALL.md#Install)
   * [Test](tutorials/INSTALL.md#Test)
   * [New game](tutorials/INSTALL.md#NewGame)
   * [Assets](tutorials/ASSETS.md)
       * [AssetManager](tutorials/ASSETS.md#AssetManager)
       * [Engine helpers](tutorials/ASSETS.md#EngineHelpers)
   * [Scenes](tutorials/SCENES.md)
       * [Scene management](tutorials/CHEATSHEET.md#SceneManagement)
   * [Cheatsheet](tutorials/CHEATSHEET.md)
       * [No WebGL](tutorials/CHEATSHEET.md#NoWebGL)
       * [Config](tutorials/CHEATSHEET.md#Config)
       * [QRCode](tutorials/CHEATSHEET.md#QRCode)
       * [Highscores](tutorials/CHEATSHEET.md#Highscores)
       * [MeshNetwork](tutorials/CHEATSHEET.md#MeshNetwork)
       * [Virtual Joystick](tutorials/CHEATSHEET.md#VirtualJoystick)
       * [Sound](tutorials/CHEATSHEET.md#Sound)
       * [Sky](tutorials/CHEATSHEET.md#Sky)
       * [Text](tutorials/CHEATSHEET.md#Text)
       * [Wireframe](tutorials/CHEATSHEET.md#Wireframe)
       * [Screenshot](tutorials/CHEATSHEET.md#Screenshot)
       * [Record video](tutorials/CHEATSHEET.md#RecordVideo)
   * [Blender](tutorials/BLENDER.md)
   * [Distribute](tutorials/DISTRIBUTE.md)
<!--te-->

## Features

* [x] engine framework
* [x] after effects with composer
* [x] toggle fullscreen - documented
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
* [x] attach object to bone (scale support)
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
* [x] distribute app for linux/mac/windows
* [x] warn user when building with dependencies.html
* [x] distribute app with gh-pages publish
* [x] build before publish/distribute and copy vrum.min.js
* [x] html icon
* [ ] set shadowMap.width and height of all lights
* [ ] tutorials
* [ ] VR
* [ ] walker
* [ ] a lot of points geometry
* [ ] tween between animation weights
* [ ] generate load_assets_file.json
* [ ] physics
* [ ] pause rendering on blur (implement own timeout affected by rendering)
