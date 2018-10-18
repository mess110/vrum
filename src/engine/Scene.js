class Scene extends THREE.Scene {
  constructor() {
    super()
    this.uptime = 0
    this.initialized = false
    this.intervals = []
    this.timeouts = []
  }

  init(options) {
  }

  _fullInit(options) {
    this.initialized = true
    this.intervals = []
    this.timeouts = []
    this.init(options)
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
    })
  }

  tick(tpf) {}

  doMouseEvent(event, raycaster) {}

  doKeyboardEvent(event) {}

  setInterval(func, time) {
    this.intervals.push(setInterval(func, time))
  }

  setTimeout(func, time) {
    this.timeouts.push(setTimeout(func, time))
  }
}
