// Used to generate after effects and enable/disable on a scene/camera basis
//
// Example usage:
//
//   Hodler.get('afterEffects').enable()
//
class AfterEffects {
  constructor() {
    this.enabled = false
    this.renderModel = new (THREE.RenderPass)(undefined, undefined) // scene, camera
  }

  render(tpf) {
    Hodler.get('renderer').clear()
    this.composer.render(tpf)
  }

  enable() {
    this.updateCamAndScene()
    this.composer = new THREE.EffectComposer(Hodler.get('renderer'))
    this.effects()
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  toggle() {
    this.enabled ? this.disable() : this.enable()
  }

  updateCamAndScene() {
    this.renderModel.camera = Hodler.get('camera')
    this.renderModel.scene = Hodler.get('scene')
  }

  // Override this method with the desired effect. See AfterEffects.bloomFilm for
  // more details.
  effects() {
  }

  // These are methods which pre-define different effects
  //
  // Example usage:
  //
  //   AfterEffects.prototype.effects = AfterEffects.bloomFilm

  static bloomFilm() {
    const effectBloom = new THREE.BloomPass(1, 5, 1.0, 2048)
    const effectFilm = new THREE.FilmPass(0.15, 0.95, 2048, false)
    effectFilm.renderToScreen = true

    this.composer.addPass(this.renderModel)
    this.composer.addPass(effectBloom)
    this.composer.addPass(effectFilm)
  }

  static bloomCopy() {
    const effectBloom = new (THREE.BloomPass)(1.25)
    const effectCopy = new (THREE.ShaderPass)(THREE.CopyShader)
    effectCopy.renderToScreen = true

    this.composer.addPass(this.renderModel)
    this.composer.addPass(effectBloom)
    this.composer.addPass(effectCopy)
  }
}
