class RenderManager {
  constructor() {
    var renderer = Hodler.get('renderer')
    var camera = Hodler.get('camera')

    if (Config.instance.window.resize) {
      // winResize.destroy()
      this.winResize = new THREEx.WindowResize(renderer, camera)
    }

    if (!Config.instance.window.contextMenu) {
      renderer.domElement.addEventListener('contextmenu', function (e) {
        e.preventDefault()
      }, false)
    }

    if (Config.instance.window.showStatsOnStart) {
      StatsManager.toggle()
    }

    this.anaglyphEffect = new THREE.AnaglyphEffect(renderer)
    this.stereoEffect = new THREE.StereoEffect(renderer)

    this.appendDom()
  }

  static initRenderer(rendererType) {
    if (isBlank(rendererType)) { rendererType = THREE.WebGLRenderer }
    if (!Utils.webgl() && rendererType == THREE.WebGLRenderer) { rendererType = PolyfillRenderer }

    var renderer = new rendererType(Config.instance.renderer)
    renderer.domElement.setAttribute('id', 'vrum-dom')
    renderer.domElement.style['z-index'] = Config.instance.ui.zIndex.dom
    renderer.gammaOutput = Config.instance.renderer.gammaOutput
    renderer.setClearColor(Config.instance.renderer.clearColor, Config.instance.renderer.clearAlpha)
    renderer.setSize(window.innerWidth, window.innerHeight)
    return renderer
  }

  static initCamera(cameraType) {
    if (isBlank(cameraType)) { cameraType = THREE.PerspectiveCamera }

    const size = Hodler.get('renderer').getSize()
    var camera = new cameraType(Config.instance.camera.fov, size.width / size.height, Config.instance.camera.near, Config.instance.camera.far)
    return camera
  }

  setWidthHeight(size) {
    var renderer = Hodler.get('renderer')
    var camera = Hodler.get('camera')

    this.anaglyphEffect.setSize(size.width, size.height)
    this.stereoEffect.setSize(size.width, size.height)
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width, size.height)
  }

  render(tpf) {
    var renderer = Hodler.get('renderer')
    var rendererDefault = Hodler.get('rendererDefault')
    var scene = Hodler.get('scene')
    var afterEffects = Hodler.get('afterEffects')

    StatsManager.update(rendererDefault)
    scene._fullTick(tpf)
    if (afterEffects.enabled) {
      afterEffects.render(tpf)
    } else {
      var camera = Hodler.get('camera')
      renderer.render(scene, camera)
    }
    VideoRecorderManager.capture(rendererDefault.domElement)
  }

  appendDom() {
    var renderer = Hodler.get('renderer')
    document.body.appendChild(renderer.domElement)
  }

  removeDom() {
    var renderer = Hodler.get('renderer')

    if (renderer.domElement.parentNode === null) { return }
    try {
      document.body.removeChild(renderer.domElement)
    } catch (e) {
      console.error(e)
    }
  }
}
