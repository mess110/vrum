class Scene4 extends Scene {
  init(options) {
    let json = AssetManager.get('boat-scene.json')
    let sceneLoader = new SceneLoader(json)

    AssetManager.loadAssets(sceneLoader.getAssets(), () => {
      sceneLoader.addToScene()
    })
  }

  tick(tpf) {}

  doKeyboardEvent(event) {
    LoadingScene.switch(event)
    if (event.type == 'keydown' && event.which == 32) {
      Engine.switch(Hodler.get('scene1'))
    }
  }
}
