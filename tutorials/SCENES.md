# Scenes

Like three.js, we use Scenes. During loading we can show a loading bar or
some information. In the background we can load assets or prepare. This is
basically a scene which handles the loading of assets. Once we finish loading,
we might want to switch to a different scene, maybe one for the main menu. Which
in turn can switch to other scenes: options, loading, credits, game scene.

The game scene contains the characters, the enviornment and everything else
the player sees. When we switch scenes we call their init and uninit methods.

```
class GameScene extends Scene {
  // Scene initialization happens here, add objects,
  // enable things etc.
  init(options) {
  }

  // automatically called when switching scenes
  // at this point, all scene children have been removed,
  // all intervals and timeouts have been cleared
  uninit() {
  }
}
```

If you want to use intervals/timeouts their are managed automatically if you
use the `scene.setInterval` and `scene.setTimeout` functions. When the scene
is uninitialized, the intervals/timeouts are also stopped.

To switch a scene use `Engine.switch(newScene)` function. This will also
take care of a smooth scene transition. Input is also disabled during switching
of scenes.

Each scene has a `tick` method. This method is called each and every single
frame of rendering. The parameter `tpf` stands for time per frame and
basically tells you how long a frame took to render. If you example you wanted
an object to spin continously, you could do:

```
class GameScene extends Scene {
  init(options) {
    this.model = Utils.plane()
  }

  tick(tpf) {
    this.model.rotation.x += tpf
  }
}
```

## Input

The scene is also responsible for handling user input. Mouse events are fired
for all mouse and touch events, touch is transformed to click. A
[Raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
object is also given which can be used to find the intersection of objects.

Keyboard events are also fired. You can also access the keyboard state from
`engine.inputManager`

If HTML GamepadAPI is supported, gamepad events are also fired. The events are:

* gamepadconnected
* gamepaddisconnected
* gamepadtick-vrum - a custom event, which is the result of `navigator.getGamepads()`

See [/workspace/games/test/gamepad-api/](/workspace/games/test/gamepad-api/) for more
details.


```
class GameScene extends Scene {
  init(options) {
    this.keyboard = Hodler.get('engine').inputManager.keyboard
  }

  tick(tpf) {
    // https://github.com/jeromeetienne/threex.keyboardstate/
    if (this.keyboard.pressed("shift+A")) {
      console.log("shift+A pressed")
    }
  }

  doMouseEvent(event, raycaster) {
    console.log(`${event.type} ${event.which} ${event.x}:${event.y} ${event.wheelDelta}`)
    if (event.type == 'mousedown') {
      console.log(raycaster.intersectObjects(this.children))
    }
  }

  doKeyboardEvent(event) {
    console.log(`${event.type} ${event.code} (${event.which})`)
  }

  doGamepadEvent(event) {
    // console.log(event.type)
  }
}
```

Several controls are implemented to help get you started:

* [OrbitControls](tutorials/CHEATSHEET.md#OrbitControls)
* [RTSCamera](tutorials/CHEATSHEET.md#RTSCamera)
* [VirtualController](tutorials/CHEATSHEET.md#VirtualController)

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
    }, Config.instance.fade.duration)
  }
}

Engine.start(new LoadingScene(), [
  // assets used in the loading screen
  { type: 'image', path: 'vrum.png' },
])
```

## Fade

Switching between scenes automatically triggers scene fade transitions

```
Utils.fade({type: 'in'})}
Utils.fade({type: 'out'})}
```

It can be customised in `Config` variables.


## SceneEditor

We have a scene editor which is a WYSIWYG editor for scenes. They are saved
as json objects. See developer tools (F12) for a list of keyboard shortcuts.

Create a scene in the editor, save it and in your code:

```
let json = AssetManager.get('scene.json')
let sceneLoader = new SceneLoader(json)

// to load the assets
AssetManager.loadAssets(sceneLoader.getAssets(), () => {})

// to populate the current scene
sceneLoader.addToScene()
```

To start the scene-editor:

```
yarn http
google-chrome http://127.0.0.1:8080/workspace/games/scene-editor/
```

## CustomScenes

There are some pre-built scenes to help you with common game related things:

* [VideoScene](/src/extra/scenes/VideoScene.js)
* [AddsScene](/src/extra/scenes/AddsScene.js)
* [LoadingScene](/src/extra/scenes/LoadingScene.js)

See an example typical game scene setup [in the test](http://127.0.0.1/workspace/games/test/scene_setup.html)
