# Scenes

Please follow [the previous tutorial](/tutorials/INSTALL.md) if you want to know how
to setup the game template for development.

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

If you want to use intervals/timeouts their are managed automatically if you use the
`scene.setInterval` and `scene.setTimeout` functions. When the scene is uninitialized,
the intervals/timeouts are also stopped.

To switch a scene use `Engine.switchScene(newScene)` function. This will also take
care of a smooth scene transition. Input is also disabled during switching of scenes.

Each scene has a `tick` method. This method is called each and every single frame of
rendering. The parameter `tpf` stands for time per frame and basically tells you how
long a frame took to render. If you example you wanted an object to spin continously,
you could do:

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

The scene is also responsible for handling user input. Mouse events are fired for all mouse and
touch events, touch is transformed to click. A [Raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
object is also given which can be used to find the intersection of objects.

Keyboard events are also fired. You can also access the keyboard state from `engine.inputManager`

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
    if (event.type == 'mousedown') {
      console.log(raycaster.intersectObjects(this.children))
    }
  }

  doKeyboardEvent(event) {
    console.log(`${event.type} ${event.code} (${event.which})`)
  }
}
```

Our game will only contain 2 scenes, the loading scene and the
main scene which will start when the player wants.

Now that you can navigate scenes, lets [load some assets](/tutorials/ASSETS.md).
