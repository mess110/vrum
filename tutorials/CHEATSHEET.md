# Cheatsheet

## NoWebGL

Warn if webgl not available

Happens automatically with the help of [/src/extras/PolyfillRenderer.js](src/extras/PolyfillRenderer.js)

## Config

See [/src/engine/Config.js](/src/engine/Config.js) comments for details

```
Config.window.resize = true
Config.renderer.alpha = false
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

See [/src/extras/MeshNetwork.js](/src/extras/MeshNetwork.js) for more info.

## VirtualJoystick

See [/src/extras/VirtualController.js](/src/extras/VirtualController.js) for more info.

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

## Tree

See [/src/objects/Tree.js](/src/objects/Tree.js) for details

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

## VirtualController

Checkout [/workspace/games/controller/](/workspace/games/controller) for example usage.

See [/src/extras/VirtualController.js](/src/extras/VirtualController.js) for details

## PoolManager

Helps you make bullets or endless monsters by reusing instantiated objects.

See [/src/extras/PoolManager.js](/src/extras/PoolManager.js) for details

## Camera

See [Camera](https://threejs.org/docs/#api/en/cameras/OrthographicCamera)

## RTSCamera

```
this.rtsCam = new RTSCamera()
this.rtsCam.tick(tpf)
this.rtsCam.doMouseEvent(event)
this.rtsCam.isStatic() // returns true if camera is not doing anything
```
