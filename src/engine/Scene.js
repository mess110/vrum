class Scene extends THREE.Scene {
  constructor() {
    super()
    // automatically incremented if the scene is ticking
    this.uptime = 0
    this.initialized = false
    // use this to prevent double actions like double load when the scene is
    // finished
    this.finished = false
    this.intervals = []
    this.timeouts = []
    // does not need to be refrehsed, support for gamepad can't change
    // on the same device
    this.gamepadSupported = Utils.gamepad()
  }

  init(options) {
  }

  _fullInit(options) {
    this.intervals = []
    this.timeouts = []
    this.init(options)
    this.initialized = true
    this.finished = false
  }

  uninit() {
  }

  _fullUninit() {
    this.initialized = false
    this.removeAllChildren()
    this.intervals.forEach((interval) => {
      clearInterval(interval)
    })
    this.timeouts.forEach((timeout) => {
      clearTimeout(timeout)
    })
    this.uninit()
    this.finished = false
  }

  _fullTick(tpf) {
    if (!this.initialized) {
      return
    }
    this.uptime += tpf
    this._tickAnimations(tpf)
    this.tick(tpf)
    if (this.gamepadSupported) {
      this._doGamepadEvent(navigator.getGamepads())
    }
  }

  _tickAnimations(tpf) {
    this.traverse(function (obj) {
      if (obj.animations instanceof Animations) {
        obj.animations.tick(tpf)
      }
      if (obj instanceof Water) {
        obj.tick(tpf)
      }
      if (obj instanceof BaseParticle) {
        obj.tick(tpf)
      }
    })
  }

  getCamera() {
    let camera = Hodler.get('camera')
    if (isBlank(camera)) { throw 'camera is blank' }
    return camera
  }

  tick(tpf) {}

  _doMouseEvent(event, raycaster) {
    if (!this.initialized) {
      return
    }
    this.doMouseEvent(event, raycaster)
  }

  doMouseEvent(event, raycaster) {}

  _doKeyboardEvent(event) {
    if (!this.initialized) {
      return
    }
    this.doKeyboardEvent(event)
  }

  doKeyboardEvent(event) {}

  _doGamepadEvent(event) {
    if (!this.initialized) {
      return
    }
    if (!(event.type == 'gamepaddisconnected' || event.type == 'gamepadconnected')) {
      // set as a custom type to make it easier to work with
      event.type = 'gamepadtick-vrum'

      let isConnected = false
      for (var i = 0; i < event.length; i++) {
        isConnected = isConnected || !isBlank(event[i])
      }
      if (!isConnected) {
        return
      }
    }
    this.doGamepadEvent(event)
  }

  /*
   * Called if gamepad is supported each frame. Also handles connect/disconnect
   *
   * All events have a type:
   *
   *  - gamepaddisconnected
   *  - gamepadconnected
   *  - gamepadtick-vrum  - custom, added by the engine to GamepadList
   *
   *  All events are streamlined into this method. Depending on what you need
   *  take the appropriate action. Keep in mind, the scene could not yet be
   *  initialized when the gamepad is initialized so don't count on getting
   *  the gamepadconnected event every time the scene starts.
   */
  doGamepadEvent(event) {}

  setInterval(func, time) {
    this.intervals.push(setInterval(func, time))
  }

  setTimeout(func, time) {
    this.timeouts.push(setTimeout(func, time))
  }
}
