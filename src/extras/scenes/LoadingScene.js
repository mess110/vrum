/*
 * Loads assets on init and switches the scene to the specified callbackScene
 *
 * Example usage:
 *
 *  let gameScene = new GameScene()
 *  let loadingScene = new LoadingScene(gameScene, [
 *    { type: "image", path: "assets/vrump.png },
 *  ]
 *
 *  Engine.start(loadingScene)
 */
class LoadingScene extends Scene {
  constructor(callbackScene, assetsToLoad) {
    if (isBlank(callbackScene)) {
      throw 'callbackScene missing'
    }
    if (!isArray(assetsToLoad)) {
      throw 'assetsToLoad needs to be an array'
    }
    super()
    this.callbackScene = callbackScene
    this.assetsToLoad = assetsToLoad
  }

  init(options) {
    let camera = Hodler.get('camera')
    camera.position.set(0, 10, 15)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.initCallback(options)

    if (Config.instance.engine.debug) {
      console.info(`loadingScene started loading ${this.assetsToLoad.length} assets`)
    }
    Engine.switch(this.callbackScene, this.assetsToLoad)
  }

  initCallback(options) {
    let cube = Utils.box({ size: 1 })
    this.add(cube)
    this.cube = cube
  }

  tick(tpf) {
    if (!isBlank(this.cube)) {
      this.cube.rotation.x += tpf
      this.cube.rotation.y += tpf
    }
  }
}
