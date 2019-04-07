Config.instance.window.showStatsOnStart = true
Config.instance.engine.debug = true

Persist.defaultJson('lastModels', [
  '/workspace/assets/models/chicken.gltf',
  '/workspace/assets/models/panda.glb',
  '/workspace/assets/models/button.glb',
])
updateLastModels()
stopPropagation()

let mainScene = new MainScene()
Hodler.add('mainScene', mainScene)

let loadingScene = new LoadingScene(mainScene, [
  { type: 'image', path: '/workspace/assets/textures/vrum.png' },
])

Engine.start(loadingScene)

let camera = Hodler.get('camera');
camera.position.set(0, 4, 10)
camera.lookAt(new THREE.Vector3(0,0,0))
