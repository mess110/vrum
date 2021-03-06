# Cheatsheet

## NoWebGL

Warn if webgl not available

Happens automatically with the help of [/src/extras/PolyfillRenderer.js](src/extras/PolyfillRenderer.js)

## Config

See [/src/engine/Config.js](/src/engine/Config.js) comments for details

```
Config.instance.window.resize = true
Config.instance.renderer.alpha = false
```

## QRCode

```
new QRCode("qrcode", { text: "hello world", width: 128, height: 128 });
```

## Highscores

Each game has its own user/pass which currently is stored client side in an insecure
way. It is "safe" to store it like this because the high scores for mini games
are not that important when prototyping the game.

After you register and api_key and secret you can `HighScoreManager.addScore` or `HighScoreManager.getScores(20)`

See [/src/extras/HighScoreManager.js](/src/extras/HighScoreManager.js) for more info.

## MeshNetwork

See [/tutorials/NETWORKING.md](/tutorials/NETWORKING.md) for a full tutorial.

```
let mn = new MeshNetwork()

mn.connect('https://mesh.opinie-publica.ro', 'room', { audio: false, video: false })
mn.onConnect = (peer) => {
  console.log(`connected with peer ${peer.cmKey}`)
}
mn.onData = (peer, data) => {
  console.log(`${data.from}: ${JSON.stringify(data)}`)
}
mn.onError = (peer, error) => {
  console.error(error)
}
mn.onClose = function (peer) => {
  console.log(`disconnected from peer ${peer.cmKey}`)
}
```

See [/src/extras/MeshNetwork.js](/src/extras/MeshNetwork.js) for more info.

## Sound

Once sounds are loaded, you can use the `SoundManager` class to play sounds.

```
SoundManager.play('orchestra.wav')
SoundManager.pause('orchestra.wav')
SoundManager.stop('orchestra.wav')
SoundManager.fadeIn('orchestra.wav', 1)
SoundManager.fadeOut('orchestra.wav', 0)
SoundManager.volume('orchestra.wav', 0.5)
SoundManager.volumeAll('orchestra.wav', 0.5)
SoundManager.looping('orchestra.wav', true)
```

For background music, we have a Playlist which can be used to loop music.

```
playlist = new Playlist(['shotgun.wav', 'hit.mp3'])
playlist.play()
SoundManager.pause(playlist.getPlayingKey())
```

## Sky

```
this.sky = new Sky()
this.sky.addToScene(this)
```

Day/night cycle can be managed with the `updateSun` function

Also see [/src/objects/Sky.js](/src/objects/Sky.js) for details
Also see [/src/objects/SkyBox.js](/src/objects/SkyBox.js) for details

## Text

Send the path to the font without the extension. This will take care of
adding the css import statements as well.

```
AssetManager.loadAssets([
  { type: 'font', path: 'assets/luckiest-guy' },
], function () {
})

var text = new BaseText({
  text: 'Press <Enter> to start', fillStyle: 'blue',
  canvasW: 1024, canvasH: 1024,
  font: '64px luckiest-guy'})
text.position.set(0, 0, 4)
text.setText('hello')
this.add(text)
```

```
* {
  font-family: 'luckiest-guy', sans-serif;
  font-size: 2em;
}
```

## Wireframe

```
scene.setWireframe(true)
model.setWireframe(true)
```

## Screenshot

```
Utils.screenshot()
```

## RecordVideo

```
VideoRecorderManager.start()
VideoRecorderManager.isRunning()
VideoRecorderManager.stop()
```

## SaveFile

```
dict = { hello: 'world' }
Utils.saveFile(dict, 'fileName.json')
```

## Fullscreen

Note: requires an event started by a user action not a script. It is a browser
limitation.

```
Utils.toggleFullscreen()
```

## Opacity

Opacity ranges from 0 (transparent) to 1 (opaque) and can be applied
recursively to all the object children as well as the object

```
let obj = new THREE.Object3D()
obj.setOpacity(0, true)
```

## DebugStats

Add a panel in the top left corner showing FPS, MB used, geometries textures
etc.

```
Config.instance.window.showStatsOnStart = true
```

## AnaglyphEffect

If you want to use your red/cyan 3d glasses

```
Utils.toggleAnaglyphEffect()
```

NOTE: Doesn't work together with StereoEffect

## StereoEffect

If you want to use a VR headset

```
Utils.toggleStereoEffect()
```

NOTE: doesn't work together with AnaglyphEffect

## AdjustRendererSize

You can adjust the renderer size with

```
engine.renderManager.setWidthHeight({ width: 320, height: 240 })
```

## Orientation

You can enforce a required screen orientation. Valid values are:

* all
* landscape
* portrait

```
Utils.orientation('landscape')
```

An screen informing the user to rotate the screen will appear over all
the other content.

## Mobile

There are 2 helpers which can identify if you are on a pc/mobile device. They
return true/false

```
Utils.isMobile()
Utils.isMobileOrTablet()
```

## Persist

You can persist data on the client in Local Storage with the help of Persist.
It supports defeault values, prefixing and different primitives.

See [/src/extras/Persist.js](/src/extras/Persist.js) for more info.

## OrbitControls

Sometimes you just want to be able to rotate around to inspect things.
Move the mouse, zoom etc.

```
Utils.toggleOrbitControls()
```

## SetSkin

The skin of a loaded model can be changed. Just make sure both the model and
the new skin have been loaded with the AssetManager

```
let chicken = AssetManager.clone('chicken.glb')
chicken.setSkin('chicken_black.png')
```

## Fog

```
scene.fog = Helper.fog('white', 0, 500)
```

## Grid

```
grid = Utils.grid({ size: 10, step: 1, color: 0xffffff})
scene.add(grid)
```

## Water

See [/src/objects/Water.js](/src/objects/Water.js) for details

```
 this.water = new Water({
   width: 100,
   height: 100,
   map: 'waternormals.jpg',
   water: {
     alpha: 0.8,
     waterColor: 0x001e0f
   }
 })
 this.add(this.water)

 this.water.setSunDirection(this.sky.light)
```

## Tree

See [/src/objects/Tree.js](/src/objects/Tree.js) for details

## Forest

See [Utils.forest()](/src/extras/Utils.js) for more details

```
let forest = Utils.forest({
  items: [
    {
      type: 'chicken.gltf',
      count: 20,
    }
  ]
})
forest.traverse(function (e) {
  if (e instanceof THREE.Scene) {
    e.animations.playRandom()
  }
})
this.add(forest)
```

## LightningBolt

See [/src/objects/LightningBolt.js](/src/objects/LightningBolt.js) for details

## SpotLight

VolumetricSpotLight

```
//                       (x, y, z, r1, r2, height)
spotLight = new SpotLight(0, 10, 0, 0.1, 2.5, 5)
spotLight.addToScene(scene)
spotLight.lookAt(new (THREE.Vector3)(0, 0, 0))
spotLight.setColor('white')
```

## Mirror

```
let mirror = new Mirror({width: 5, height: 5})
this.add(mirror)
```

See [/src/objects/Mirror.js][/src/objects/Mirror.js] for more info.

## Shadows

To enable shadows, you need to toggle them.

```
Utils.toggleShadows()
```

You can configure shadow details with:

```
Utils.setShadowDetails(512, 512)
Utils.setShadowDetails(Config.instance.shadow.details.low)
Utils.setShadowDetails('medium')
Utils.setShadowDetails('high')
Utils.setShadowDetails('ultra')
```

Shadow behaviour can be controlled per object basis with the help of:

```
let bunny = AssetManager.clone('bunny.gltf')
bunny.shadowCastAndNotReceive()

let ground = AssetManager.clone('ground.gltf')
ground.shadowReceive()
```

## LightHelpers

To help debug lights, you can add wireframe objects around lights so they can
be seen better.

```
Utils.toggleShadowCameraHelpers()
```

## Frustum

If some object dissapear off the screen at certain camera angles you can try
setting its frustum culled to false to draw it all the time.

```
Utils.setFrustumCulled(object, false);
```

## VirtualController

VirtualJoystick allows emulating a game controller on the display. It is
customizable but tries to have sane defaults. The jist of it is instantiating
the object and adding listeners:

```
let vc = new VirtualController()
let joystick1 = vc.joystick1

joystick1.addEventListener('touchStart', function () {
  // do something
})

joystick1.addEventListener('touchEnd', function () {
  // do something else. or not, I am just a comment
})

// check the state of the joystick with:
joystick1.deltaX()
joystick1.deltaY()
joystick1.up()
joystick1.down()
joystick1.left()
joystick1.right()
```

Checkout [/workspace/games/controller/](/workspace/games/controller) for example usage.

See [/src/extras/VirtualController.js](/src/extras/VirtualController.js) for details

## PoolManager

Helps you make bullets or endless monsters by reusing instantiated objects.

See [/src/extras/PoolManager.js](/src/extras/PoolManager.js) for details

## Camera

The default camera is the perspective camera. If the defaults don't work for you
checkout `Config.instance.camera`. The other camera type is ortographic. Think
2d games.

You can change the camera by changing the `type`. Make sure you set the variable
before calling start.

```
Config.instance.camera.type = 'ortographic'
```

If you want an even finer control, you can use the helper `Utils.camera`
or override the `initCamera` method called by the renderer.

```
RenderManager.initCamera = () => {
  return Utils.camera({ type: 'ortographic' })
}
```

[OrthographicCamera](https://threejs.org/docs/#api/en/cameras/OrthographicCamera):
[PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera):

Adjust distance with `fov`

```
Config.instance.camera.fov = 50
```

## RTSCamera

```
this.rtsCam = new RTSCamera()
this.rtsCam.tick(tpf)
this.rtsCam.doMouseEvent(event)
this.rtsCam.isStatic() // returns true if camera is not doing anything
this.rtsCam.toggle()

// bound the panning to an area
this.rtsCam.oc.panBound = true
this.rtsCam.oc.panBoundRectangle = new THREE.Vector4(-10, 10, -10, 10)
// x - left most point
// y - right most point
// z - top most point
// w - bottom most point
```

## Terrain

```
this.terrain = Terrain.fromJson(AssetManager.get('terrain.json'))
this.terrain.shadowReceive()
this.add(this.terrain)
```

## Particles

[ShaderParticleEngine](https://github.com/squarefeet/ShaderParticleEngine/)
[GroupOptions](https://squarefeet.github.io/ShaderParticleEngine/docs/api/global.html#GroupOptions)
[EmitterOptions](https://squarefeet.github.io/ShaderParticleEngine/docs/api/global.html#EmitterOptions)

The structure for the saved json is:

```
{
  "kind": "particle",                 // this is mandatory
  "textures": [                       // array of images used
    { "libPath": "/path/to/img.png" } // libPath - where the image is loaded from
  ]
  "particle": [                       // the actual particle
  ]
}
```

"particle" can be a string or an array of strings which will be joined. It
should form a valid array of obects. Each object represents a `Group` and
each group can have an array of emitters under the `emitters` key.

```
let jsonParticleData = AssetManager.get('particle.json').particle
this.explosion = new BaseParticle(jsonParticleData)
this.add(this.explosion)

this.explosion.tick(tpf)
```


## Shaders

https://thebookofshaders.com/

```
let json = AssetManager.get('basic_shader.json')
let material = new ShaderMaterial(json)
let material = new ShaderMaterial(json, "function (tpf) { this.uniforms.time.value += tpf * 2 }")
let material = new ShaderMaterial(json, function (tpf) {
  this.uniforms.time.value += tpf * 2
})
material.tick(tpf)
```

```
let json = AssetManager.get('dissolve_shader.json')
let material = new ShaderMaterial(json)
material.tick(tpf)
```

## Graffiti

Art generator or graffiti

```
this.art = Utils.graffiti(AssetManager.get('majestic-frog-cover.json'))
this.add(this.art)
```

## Console

An on screen console is provided. It needs an update. It can be used to inspect
logs on mobile devices.

```
Utils.console() // toggles the console
```

## Tweens

Tweens are used to smoothly transform object properties.

To read about them check [this](https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md)
and the [list of smoothing curves](http://tweenjs.github.io/tween.js/examples/03_graphs.html)

A base implementation of tweens can be found [here](src/extras/Modifiers.js)

## Modifiers

* BaseModifier
* FadeModifier (chaining bugged)
* ScaleModifier
* WeightModifier (used to ease into animations)

```
var up = new BaseModifier(text.position, { x: '+1' }, 1000, TWEEN.Easing.Linear.None)
var down = new BaseModifier(text.position, { x: '-1' }, 1000)
up.chain(down)
down.chain(up)
up.start()
```

```
// chaining is bugged with the fade modifier, do this instead
let duration = 3000
this.setInterval(() => {
  let fadeOut = new FadeModifier(text, 1, 0.1, duration)
  let fadeIn = new FadeModifier(text, 0.1, 1, duration)
    .delay(duration)
  fadeOut.start()
  fadeIn.start()
}, duration * 2)
```

## Video

Playing a video works by creating a fullscreen div and adding a scalable
video element to it. The video removes itself by calling `removeVideo`
automatically when the video finishes playing.

```
Utils.playVideo("assets/agent.mp4", () => {
  // optional, called when video has finished playing
  // at this point, removeVideo was automatically called with
  // no callback and the video tag is gone.
})

Utils.isPlayingVideo()

// if you want to fade the scene before removing the video, you can set
// a delay on the removeVideo()
let delay = Config.instance.fade.duration // defaults to 1000 ms
Utils.removeVideo(() => {
  // optional, called when the video tag is removed
}, delay)

Utils.removeVideo(undefined, 0)
```

A cinematic can be played with the help of the [VideoScene](/src/extra/scenes/VideoScene.js)

```
let skippable = true
let gameScene = new GameScene()
let videoScene = new VideoScene(gameScene, "assets/agent.mp4", skippable)

Engine.start(videoScene)
```

## Starfield

Or an example with a lot of points.

```
let starfield = new Starfield()
this.add(starfield)
```

## ToonOutline

```
Utils.addMeshOutlineTo(cube, outlineCube, 3, outlineMaterial)
```

There are a few helper methods to help you get started with giving a toon
outline effect. It works is by overlaying the same shaped object with an outline
material to a target. The outline object has its scaled increase by the
specified percent.

```
let geometry = new THREE.BoxGeometry( 1, 1, 1 )
let material = new THREE.MeshBasicMaterial( { color: 0x4d4d4d } )

let cube = new THREE.Mesh( geometry, material )
let outlineCube = new THREE.Mesh( geometry, material )

Utils.addMeshOutlineTo(cube, outlineCube)

this.add(cube)
```

For `Utils.addMeshOutlineTo` you can pass optional params `scalePercent` to
change the size of the outline (default 3) and outlineMaterial if you want to
use a different material.

To create an outline material use `Utils.outlineMaterial()`. It has 2 params,
`color` and `thickness`. Defaults are black and 0.002

```
let outlineMaterial = Utils.outlineMaterial('black', 0.002)
```

Adding an outline to meshes cloned with AssetManager is super simple, it even
takes care of animating the outline object. Use `Utils.addOutline()` which
takes the mesh, scalePercent and outlineMaterial as params

```
let chicken = AssetManager.clone('chicken.gltf')
Utils.addOutline(chicken)
chicken.animations.play('walk')
this.add(chicken)
```
