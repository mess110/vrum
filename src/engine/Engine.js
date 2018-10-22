class Engine {
  constructor() {
    this.running = false
    this.frameIndex = null
    this.uptime = 0
    this.time = undefined
    this.renderManager = new RenderManager()
    this.inputManager = new InputManager()

    this.tick = this.tick.bind(this)
  }

  static start(scene, cam) {
    Hodler.add('scene', scene)

    var renderer = RenderManager.initRenderer()
    Hodler.add('rendererDefault', renderer)
    Hodler.add('renderer', renderer)

    var camera = RenderManager.initCamera(cam)
    Hodler.add('camera', camera)

    var engine = new Engine()
    Hodler.instance.add('engine', engine)

    var afterEffects = new AfterEffects()
    Hodler.add('afterEffects', afterEffects)

    scene._fullInit()
    engine.start()
    return engine
  }

  static switchScene(scene) {
    // TODO: disable input
    var duration = 1000

    Utils.fade({ type: 'in', duration: duration })
    Utils.delay(function () {
      var oldScene = Hodler.get('scene')
      if (oldScene !== null) {
        oldScene._fullUninit()
      }
      Hodler.add('scene', scene)
      scene._fullInit()
      var engine = Hodler.get('engine')
      Hodler.get('afterEffects').updateCamAndScene()
      Utils.fade({ type: 'out', duration: duration })
    }, duration)
  }

  start() {
    this.running = true
    this.tick()
  }

  stop() {
    cancelAnimationFrame(this.frameIndex)
    this.frameIndex = undefined
    this.running = false
  }

  tick() {
    if (!this.running) {
      return
    }
    var tpf = this._getTimePerFrame()
    TWEEN.update()
    this.renderManager.render(tpf)
    if (this.takeScreenshot) {
      this.takeScreenshot = undefined
      Utils.saveScreenshot()
    }
    this.frameIndex = requestAnimationFrame(this.tick)
  }

  _getTimePerFrame() {
    const now = new Date().getTime()
    const tpf = (now - (this.time || now)) / 1000
    this.time = now
    this.uptime += tpf
    return tpf
  }
}
