// Used to generate after effects and enable/disable on a scene/camera basis
// Overwrite the effects method to get the required effect
class AfterEffects {
  constructor() {
    this.enabled = false
    this.renderModel = new (THREE.RenderPass)(undefined, undefined) // scene, camera
    this.effects()
  }

  render(tpf) {
    Hodler.get('renderer').clear()
    this.composer.render(tpf)
  }

  effects() {
    const effectBloom = new (THREE.BloomPass)(1.25)
    const effectCopy = new (THREE.ShaderPass)(THREE.CopyShader)
    effectCopy.renderToScreen = true
    var composer = new (THREE.EffectComposer)(Hodler.get('renderer'))
    composer.addPass(this.renderModel)
    composer.addPass(effectBloom)
    composer.addPass(effectCopy)
    this.composer = composer
  }

  updateCamAndScene() {
    this.renderModel.camera = Hodler.get('camera')
    this.renderModel.scene = Hodler.get('scene')
  }

  enable() {
    this.updateCamAndScene()
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }
}
