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
    var geometry = new THREE.BoxGeometry( 1, 1, 1 )
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
    var cube = new THREE.Mesh( geometry, material )
    this.add(cube)

    let camera = Hodler.get('camera');
    camera.position.set(0, 10, 15)
    camera.lookAt(new THREE.Vector3(0,0,0))

    Engine.switch(this.callbackScene, this.assetsToLoad)
  }
}
