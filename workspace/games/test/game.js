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


var scene1 = new Scene1()
Hodler.add('scene1', scene1)
var scene2 = new Scene2()
var loadingScene = new LoadingScene()

Persist.default('name', 'player1')
console.log(Persist.get('name'))

Engine.start(loadingScene)

AfterEffects.prototype.effects = AfterEffects.bloomFilm
// Hodler.get('afterEffects').enable()
