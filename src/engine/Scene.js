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

  setInterval(func, time) {
    this.intervals.push(setInterval(func, time))
  }

  setTimeout(func, time) {
    this.timeouts.push(setTimeout(func, time))
  }
}
