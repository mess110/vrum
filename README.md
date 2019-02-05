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
       * [Input](tutorials/SCENES.md#Input)
       * [Scene management](tutorials/SCENES.md#SceneManagement)
       * [Fade](tutorials/SCENES.md#Fade)
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
       * [Fullscreen](tutorials/CHEATSHEET.md#Fullscreen)
       * [Opacity](tutorials/CHEATSHEET.md#Opacity)
       * [Debug Stats](tutorials/CHEATSHEET.md#DebugStats)
       * [AnaglyphEffect](tutorials/CHEATSHEET.md#AnaglyphEffect)
       * [StereoEffect](tutorials/CHEATSHEET.md#StereoEffect)
       * [Adjust renderer size](tutorials/CHEATSHEET.md#AdjustRendererSize)
       * [Orientation](tutorials/CHEATSHEET.md#Orientation)
       * [Persist](tutorials/CHEATSHEET.md#Persist)
       * [OrbitControls](tutorials/CHEATSHEET.md#OrbitControls)
       * [Set Skin](tutorials/CHEATSHEET.md#SetSkin)
       * [Fog](tutorials/CHEATSHEET.md#Fog)
       * [Grid](tutorials/CHEATSHEET.md#Grid)
   * [Blender](tutorials/BLENDER.md)
   * [Distribute](tutorials/DISTRIBUTE.md)
<!--te-->

## Features

* [x] engine framework
* [x] after effects with composer
* [x] toggle fullscreen
* [x] keyboard/mouse/touch input
* [x] keyboard long pressed
* [x] warn if webgl not available
* [x] auto-resize
* [x] config
* [x] fade between scenes
* [x] change opacity of objects
* [x] debug stats (fps, memory, geometries, textures, points etc.)
* [x] anaglyph effect
* [x] stereo effect
* [x] adjust renderer width/height
* [x] require specific screen orientation
* [x] persist data in localStorage
* [x] sound manager
* [x] clear scene recursively
* [x] toggle wireframe
* [x] orbit controls helper
* [x] take screenshots
* [x] record videos
* [x] skybox
* [x] clone loaded objects instead of direct use
* [x] handle timeout/interval clear on uninit scene (this.setInterval/this.setTimeout)
* [x] html icon
* [x] distribute app for linux/mac/windows
* [x] warn user when building with dependencies.html
* [x] distribute app with gh-pages publish
* [x] build before publish/distribute and copy vrum.min.js
* [x] loading done event
* [x] change model skin
* [x] fog
* [x] text
* [x] grid helper

## Undocumented features

* [x] tween objects around
* [x] modifiers - predefined tweens
* [x] pool manager
* [x] attach object to bone (scale support)
* [x] load images
* [x] load sounds
* [x] load json models
* [x] load gltf models
* [x] load glb models
* [x] load json files
* [x] load shaders
* [x] procedural tree
* [x] water
* [x] day/night cycle
* [x] particle system
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
* [x] qr code generator
* [x] on screen controls
* [x] fine animation controls
* [x] mesh networking
* [x] game pad controller game
* [ ] set shadowMap.width and height of all lights
* [ ] tutorials
* [ ] VR
* [ ] walker
* [ ] a lot of points geometry
* [ ] tween between animation weights
* [ ] generate load_assets_file.json
* [ ] physics
* [ ] pause rendering on blur (implement own timeout affected by rendering)
