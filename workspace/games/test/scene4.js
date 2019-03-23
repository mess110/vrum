class Scene4 extends Scene {
  init(options) {
    let json = AssetManager.get('boat-scene.json')
    let sceneLoader = new SceneLoader(json)

    AssetManager.loadAssets(sceneLoader.getAssets(), () => {
      sceneLoader.addToScene()
    })
  }

  tick(tpf) {}
}
