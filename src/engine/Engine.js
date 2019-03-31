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

  // Load specified assets, once that is done start the engine
  // and run init for the scene
  static start(scene, assets) {
    if (isBlank(scene)) { throw 'scene is blank' }
    if (!(scene instanceof Scene)) { throw 'scene param must be an instance of Scene' }

    Hodler.add('scene', scene)

    var renderer = RenderManager.initRenderer()
    Hodler.add('rendererDefault', renderer)
    Hodler.add('renderer', renderer)

    var camera = RenderManager.initCamera()
    Hodler.add('camera', camera)

    var engine = new Engine()
    Hodler.instance.add('engine', engine)

    var afterEffects = new AfterEffects()
    Hodler.add('afterEffects', afterEffects)

    AssetManager.loadAssets(assets, () => {
      Utils.fade({ type: 'out', duration: 1000})
      scene._fullInit()
      engine.start()
    })
    return engine
  }

  // Loads specified assets, once that is done, uninits the current scene,
  // and witches to the specified scene
  static switch(scene, assets) {
    if (isBlank(scene)) { throw 'scene is blank' }
    if (!(scene instanceof Scene)) { throw 'scene param must be an instance of Scene' }

    AssetManager.loadAssets(assets, () => {
      var duration = Config.instance.fade.duration
      var engine = Hodler.get('engine')
      engine.inputManager.disable()

      Utils.fade({ type: 'in', duration: duration })
      Utils.delay(function () {
        var oldScene = Hodler.get('scene')
        if (Hodler.has('scene')) {
          oldScene._fullUninit()
        }
        Hodler.add('scene', scene)
        scene._fullInit()
        Hodler.get('afterEffects').updateCamAndScene()
        Utils.fade({ type: 'out', duration: duration })
        engine.inputManager.enable()
      }, duration)
    })
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
