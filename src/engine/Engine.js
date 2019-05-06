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
  static start(scene, assets, options) {
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
      scene._fullInit(options)
      engine.start()
    })
    return engine
  }

  // Loads specified assets, once that is done, uninits the current scene,
  // and witches to the specified scene
  static switch(scene, assets, options) {
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
        scene._fullInit(options)
        Hodler.get('afterEffects').updateCamAndScene()
        Utils.fade({ type: 'out', duration: duration })
        engine.inputManager.enable()
      }, duration)
    })
  }

  start() {
    this.running = true
    if (isBlank(Config.instance.engine.fixedFPS)) {
      this.tick()
    } else {
      this.fixedTick()
    }
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

    RStatsManager.startMeasure()

    let tpf = this._getTimePerFrame()
    TWEEN.update()

    RStatsManager.midMeasure()

    this.renderManager.render(tpf)
    if (this.takeScreenshot) {
      this.takeScreenshot = undefined
      Utils.saveScreenshot()
    }

    RStatsManager.endMeasure()

    this.frameIndex = requestAnimationFrame(this.tick)
  }

  fixedTick() {
    let engine = Hodler.get('engine')
    if (!engine.running) {
      return
    }

    RStatsManager.startMeasure()

    let tpf = 1000 / Config.instance.engine.fixedFPS
    TWEEN.update()

    RStatsManager.midMeasure()

    setTimeout(() => {
      engine.frameIndex = requestAnimationFrame(engine.fixedTick)
    }, tpf)
    engine.renderManager.render(tpf / 1000)

    if (engine.takeScreenshot) {
      engine.takeScreenshot = undefined
      Utils.saveScreenshot()
    }

    RStatsManager.endMeasure()
  }

  _getTimePerFrame() {
    const now = new Date().getTime()
    const tpf = (now - (this.time || now)) / 1000
    this.time = now
    this.uptime += tpf
    return tpf
  }
}
