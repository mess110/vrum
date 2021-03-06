# ![vrum.js icon](workspace/games/project/assets/favicon.ico) vrum

Game engine based on three.js

```
yarn install
yarn h // prints help
```

## Thanks

* [three.js](https://threejs.org/)
* [tween.js](https://github.com/tweenjs/tween.js)
* [ShaderParticleEngine](https://github.com/squarefeet/ShaderParticleEngine)
* [howler.js](https://github.com/goldfire/howler.js)
* [jeromeetienne](https://github.com/jeromeetienne/)

And all the [other dependencies](/package.json) vrum.js is using

## Games

When desining a game maybe think about

* complementary colors
* contrast
* negative space
* Dan Harmon Story Circle

## Tutorial

<!--ts-->
   * [About](tutorials/INSTALL.md#About)
   * [Install](tutorials/INSTALL.md#Install)
   * [Test](tutorials/INSTALL.md#Test)
   * [New game](tutorials/INSTALL.md#NewGame)
   * [Tools](tutorials/INSTALL.md#Tools)
       * [model-viewer](tutorials/ASSETS.md#ModelViewer)
       * [json-editor](tutorials/ASSETS.md#JSONEditor)
       * [scene-editor](tutorials/SCENES.md#SceneEditor)
   * [Assets](tutorials/ASSETS.md)
       * [AssetManager](tutorials/ASSETS.md#AssetManager)
       * [Models](tutorials/ASSETS.md#Models)
       * [Animations](tutorials/ASSETS.md#Animations)
       * [JSON](tutorials/ASSETS.md#JSON)
       * [Engine helpers](tutorials/ASSETS.md#EngineHelpers)
   * [Scenes](tutorials/SCENES.md)
       * [Input](tutorials/SCENES.md#Input)
       * [Scene management](tutorials/SCENES.md#SceneManagement)
       * [Fade](tutorials/SCENES.md#Fade)
       * [SceneEditor](tutorials/SCENES.md#SceneEditor)
       * [Custom scenes](tutorials/SCENES.md#CustomScenes)
   * [Cheatsheet](tutorials/CHEATSHEET.md)
       * Objects
           * [Sky](tutorials/CHEATSHEET.md#Sky)
           * [Starfield](tutorials/CHEATSHEET.md#Starfield)
           * [Text](tutorials/CHEATSHEET.md#Text)
           * [Fog](tutorials/CHEATSHEET.md#Fog)
           * [Grid](tutorials/CHEATSHEET.md#Grid)
           * [Water](tutorials/CHEATSHEET.md#Water)
           * [Tree](tutorials/CHEATSHEET.md#Tree)
           * [Forest](tutorials/CHEATSHEET.md#Forest)
           * [LightningBolt](tutorials/CHEATSHEET.md#LightningBolt)
           * [Mirror](tutorials/CHEATSHEET.md#Mirror)
           * [Terrain](tutorials/CHEATSHEET.md#Terrain)
           * [Particles](tutorials/CHEATSHEET.md#Particles)
           * [Graffiti](tutorials/CHEATSHEET.md#Graffiti)
       * Lights
           * [SpotLight](tutorials/CHEATSHEET.md#SpotLight)
           * [Shadows](tutorials/CHEATSHEET.md#Shadows)
           * [LightHelpers](tutorials/CHEATSHEET.md#LightHelpers)
           * [Frustum](tutorials/CHEATSHEET.md#Frustum)
       * Dev
           * [Wireframe](tutorials/CHEATSHEET.md#Wireframe)
           * [Screenshot](tutorials/CHEATSHEET.md#Screenshot)
           * [Record video](tutorials/CHEATSHEET.md#RecordVideo)
           * [Save file](tutorials/CHEATSHEET.md#SaveFile)
           * [Debug Stats](tutorials/CHEATSHEET.md#DebugStats)
           * [Adjust renderer size](tutorials/CHEATSHEET.md#AdjustRendererSize)
           * [Orientation](tutorials/CHEATSHEET.md#Orientation)
           * [Mobile](tutorials/CHEATSHEET.md#Mobile)
           * [Persist](tutorials/CHEATSHEET.md#Persist)
       * Controls
           * [OrbitControls](tutorials/CHEATSHEET.md#OrbitControls)
           * [RTSCamera](tutorials/CHEATSHEET.md#RTSCamera)
           * [VirtualController](tutorials/CHEATSHEET.md#VirtualController)
       * Misc
           * [Toon outline](tutorials/CHEATSHEET.md#ToonOutline)
           * [Config](tutorials/CHEATSHEET.md#Config)
           * [Sound](tutorials/CHEATSHEET.md#Sound)
           * [QRCode](tutorials/CHEATSHEET.md#QRCode)
           * [Highscores](tutorials/CHEATSHEET.md#Highscores)
           * [MeshNetwork](tutorials/CHEATSHEET.md#MeshNetwork)
           * [Fullscreen](tutorials/CHEATSHEET.md#Fullscreen)
           * [Opacity](tutorials/CHEATSHEET.md#Opacity)
           * [AnaglyphEffect](tutorials/CHEATSHEET.md#AnaglyphEffect)
           * [StereoEffect](tutorials/CHEATSHEET.md#StereoEffect)
           * [Set Skin](tutorials/CHEATSHEET.md#SetSkin)
           * [PoolManager](tutorials/CHEATSHEET.md#PoolManager)
           * [Shaders](tutorials/CHEATSHEET.md#Shaders)
           * [Console](tutorials/CHEATSHEET.md#Console)
           * [Tweens](tutorials/CHEATSHEET.md#Tweens)
           * [Modifiers](tutorials/CHEATSHEET.md#Modifiers)
           * [Video](tutorials/CHEATSHEET#Video)
           * [No WebGL](tutorials/CHEATSHEET.md#NoWebGL)
   * [Blender](tutorials/BLENDER.md)
   * [Distribute](tutorials/DISTRIBUTE.md)
      * [Webserver](tutorials/DISTRIBUTE.md#Executable)
      * [Executable](tutorials/DISTRIBUTE.md#Executable)
      * [GithubPages](tutorials/DISTRIBUTE.md#GithubPages)
      * [LiveReload](tutorials/DISTRIBUTE.md#LiveReload)
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
* [x] high score manager (backed by https://json.northpole.ro)
* [x] mesh networking
* [x] water
* [x] procedural tree
* [x] day/night cycle
* [x] lightning bolt
* [x] on screen controls
* [x] pool manager
* [x] RTSCamera
* [x] live reload
* [x] load images
* [x] load sounds
* [x] load gltf models
* [x] load glb models
* [x] volumetric spotlight
* [x] scene editor
* [x] load json files (terrain/particles/shaders/graffiti)
* [x] json editor
* [x] load shaders
* [x] particle system
* [x] graffiti generator (layered painting)
* [x] light helpers
* [x] terrain with heightmap
* [x] qr code generator
* [x] on screen console
* [x] forest generator
* [x] mirror
* [x] attach object to bone (scale support)
* [x] shadows
* [x] tween objects around
* [x] modifiers - predefined tweens
* [x] animations
* [x] play movie on demand, VideoScene
* [x] preloading screen, show logos, multiple images, skippable etc
* [x] gamepad-api
* [x] set shadowMap.width and height of all lights
* [x] toon outline

## Undocumented features

* [x] mesh game pad controller game
* [x] RayScanner
* [x] Utils.boundingBox and RayScanner.addCollidable
* [x] Player control PositionXZRotationYControls
* [x] Button3D , setColor
* [x] Measure
* [x] Utils.lerpCamera(target, distance, speed)
* [x] Utils.addCEButton
* [x] TypeWriter
* [ ] RStatsManager.toggleStats()
* [ ] test all SceneLoader features
* [ ] wind effect with blowing leaves partciles
* [ ] smoke effect for wheels when they hit the edge particles
* [ ] small explosion effect particles
* [ ] next/prev button
* [ ] VR
* [ ] walker
* [ ] tween between animation weights
* [ ] generate load_assets_file.json
* [ ] physics
* [ ] pause rendering on blur (implement own timeout affected by rendering)
* [ ] auto generating documentation/cheatsheet from top level block comment

https://www.youtube.com/watch?v=L0zzY5ZeDh8

* [ ] qr code to join game top right
* [ ] scan qr code on join game screen
* [ ] controlled weapon position persistent. if the control moves and a player joins, the new player will see the wrong control position
* [ ] delete player when switching to menu fix menu
* [ ] give feedback to controller, like how much health, when dead etc.
