class Scene extends THREE.Scene {
  constructor() {
    super()
    this.uptime = 0
    this.initialized = false
  }

  init(options) {
  }

  _fullInit(options) {
    this.initialized = true
    this.init(options)
  }

  uninit() {
  }

  _fullUninit() {
    this.initialized = false
    this.removeAllChildren()
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
      if ('animationMixer' in obj) {
        obj.animationMixer.update(tpf)
      }
    })
  }

  tick(tpf) {}

  doMouseEvent(event, raycaster) {}

  doKeyboardEvent(event) {}
}
