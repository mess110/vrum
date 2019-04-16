// Persist.set('username', this.value)

MeshNetwork.instance = new MeshNetwork()
Utils.orientation('landscape')
Persist.default('username', 'player')

let controllerScene = new ControllerScene()
let landingScene = new LandingScene()
let roomId = MeshNetwork.getRoomId()
let username = Persist.get('username')

let startScene
if (isBlank(roomId)) {
  startScene = landingScene
} else {
  startScene = controllerScene
}

Engine.start(startScene, [
  { type: 'font', path: '/workspace/assets/fonts/luckiest-guy' },

  { type: 'model', path: '/workspace/assets/models/button.bg.001.glb' },
  { type: 'model', path: '/workspace/assets/models/button.fg.001.glb' },
])
