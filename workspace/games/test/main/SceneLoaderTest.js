class SceneLoaderTest extends Scene {
  init(options) {
    resetCamPosition()

    let json = AssetManager.get('boat-scene.json')
    let sceneLoader = new SceneLoader(json)

    AssetManager.loadAssets(sceneLoader.getAssets(), () => {
      sceneLoader.addToScene()
    })
  }

  tick(tpf) {}

  doKeyboardEvent(event) {
    switchScene(event)
    if (event.type == 'keydown' && event.which == 32) {
      Engine.switch(Hodler.get('scene1'))
    }
  }
}
