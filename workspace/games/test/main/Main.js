Config.instance.engine.debug = true
Config.instance.window.showStatsOnStart = true

class Box extends THREE.Mesh {
  constructor() {
    var geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4 )
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } )
    super(geometry, material)
    this.shadowCastAndNotReceive()
  }
}

PoolManager.on('spawn', Box, function (item) {
  if (isBlank(item.outline)) {
    Utils.addMeshOutlineTo(item, new Box())
  }
  item.position.set(-2, 5, 0)
  Hodler.get('scene').add(item)
})

PoolManager.on('release', Box, function (item) {
  Hodler.get('scene').remove(item)
})

HighScoreManager.auth('guest', 'guest')
HighScoreManager.get().responseHandler = function (data) {
  console.log(data)
}
HighScoreManager.getScores(20)

const switchScene = (event) => {
  if (event.type != 'keydown') { return }
  if (!event.code.startsWith('Digit')) { return }
  let digit = parseInt(event.code[5])
  if (!(0 <= digit && digit < 10)) { return }
  let sceneKey = `scene${digit}`
  if (!Hodler.has(sceneKey)) { return }
  Engine.switch(Hodler.get(sceneKey))
}

const resetCamPosition = (distance) => {
  if (isBlank(distance)) { distance = 20 }
  let camera = Hodler.get('camera')
  camera.position.set(0, distance, distance)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  return camera
}

let scene1 = new FeaturesTest()
let scene2 = new Scene2()
let scene3 = new Scene3()
let scene4 = new SceneLoaderTest()
let scene5 = new CameraTest()
let loadingScene = new LoadingScene(scene1, [
  { type: 'font',  path: '/workspace/assets/fonts/luckiest-guy' },
  { type: 'model', path: '/workspace/assets/models/chicken.gltf' },
  { type: 'model', path: '/workspace/assets/models/chicken.gltf' },
  { type: 'model', path: '/workspace/assets/models/panda.glb' },
  { type: 'image', path: '/workspace/assets/models/chicken.png' },
  { type: 'image', path: '/workspace/assets/textures/chicken_black.jpeg' },
  { type: 'image', path: '/workspace/assets/textures/hand.png' },
  { type: 'image', path: '/workspace/assets/textures/heightmap3.png' },
  { type: 'image', path: '/workspace/assets/textures/waternormals.jpg' },
  { type: 'image', path: '/workspace/assets/textures/spe_smokeparticle.png' },
  { type: 'image', path: '/workspace/assets/textures/spe_sprite-explosion2.png' },
  { type: 'image', path: '/workspace/assets/textures/black-faded-border.png' },
  { type: 'image', path: '/workspace/assets/textures/vrum.png' },
  { type: 'image', path: '/workspace/assets/textures/grass.png' },
  { type: 'json',  path: '/workspace/assets/particles/particle.json' },
  { type: 'json',  path: '/workspace/assets/graffiti/majestic-frog-cover.json' },
  { type: 'json',  path: '/workspace/assets/shaders/basic_shader.json' },
  { type: 'json',  path: '/workspace/assets/shaders/dissolve_shader.json' },
  { type: 'json',  path: '/workspace/assets/terrains/terrain.json' },
  { type: 'json',  path: '/workspace/assets/scenes/boat-scene.json' },
  { type: 'sound', path: '/workspace/assets/sounds/hit.wav' },
  { type: 'sound', path: '/workspace/assets/sounds/SuperHero_original.ogg' },
])

Hodler.add('scene1', scene1)
Hodler.add('scene2', scene2)
Hodler.add('scene3', scene3)
Hodler.add('scene4', scene4)
Hodler.add('scene5', scene5)

Persist.default('name', 'player1')
console.log(Persist.get('name'))

// Config.instance.camera.type = 'ortographic'
Engine.start(loadingScene)

AfterEffects.prototype.effects = AfterEffects.bloomFilm
// Hodler.get('afterEffects').enable()
