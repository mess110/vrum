# Cheatsheet

## NoWebGL

Warn if webgl not available

Happens automatically with the help of [src/extras/PolyfillRenderer.js](src/extras/PolyfillRenderer.js)

## Config

See [src/engine/Config.js](src/engine/Config.js) comments for details

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

See [src/extras/HighScoreManager.js](src/extras/HighScoreManager.js) for more info.

## MeshNetwork

See [src/extras/MeshNetwork.js](src/extras/MeshNetwork.js) for more info.

## VirtualJoystick

See [src/extras/VirtualController.js](src/extras/VirtualController.js) for more info.

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
this.sky = new Sky();
this.sky.addToScene(this)
```

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

## SceneManagement

Scene loading/management. Load assets. Once loading is done, start the
specified scene

```
Engine.start(new LoadingScene(), [
  { type: 'image', path: 'vrum.png' },
])
```

Load assets. Once loading is done, switch to the specified scene

```
Engine.switch(new GameScene(), [
  { type: 'image', path: 'vrum.png' },
])
```

Example with custom loading screen (don't forget to set the camera if you
custmoize)

```
class LoadingScene extends Scene {
  init(options) {
    // setTimeout is used to not skip the first fade in
    this.setTimeout(() => {
      Engine.switch(new GameScene(), [
        // assets used in the game
        { type: 'image', path: 'vrum.png' },
      ])
    }, 1000)
  }
}

Engine.start(new LoadingScene(), [
  // assets used in the loading screen
  { type: 'image', path: 'vrum.png' },
])
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
