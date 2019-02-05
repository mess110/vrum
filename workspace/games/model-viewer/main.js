Config.instance.window.showStatsOnStart = true
Config.instance.engine.debug = true

let wireframe = false

Persist.defaultJson('lastModels', [
  '/workspace/assets/models/chicken.json',
  '/workspace/assets/models/skeleton.json',
  '/workspace/assets/models/panda.glb',
  '/workspace/assets/models/button.glb',
])
updateLastModels()
stopPropagation()

var loadingScene = new LoadingScene()
var mainScene = new MainScene()
Hodler.add('mainScene', mainScene)

Engine.start(loadingScene)

let camera = Hodler.get('camera');
camera.position.set(0, 2, 5)
camera.lookAt(new THREE.Vector3(0,0,0))
