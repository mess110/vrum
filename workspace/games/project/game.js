class MainScene extends Scene {
  init(options) {
    this.add(new THREE.AmbientLight(0xffffff))
    this.model = Utils.plane({ map: 'vrum.png', width: 6.4, height: 3.68 })
    this.add(this.model)
  }

  tick(tpf) {
    this.model.rotation.x += tpf
    this.model.rotation.y += tpf
  }
}

class LoadingScene extends MainScene {
  init(options) {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 )
    var material = new THREE.MeshBasicMaterial({ color: 'red' })
    this.model = new THREE.Mesh(geometry, material)
    this.add(this.model)

    AssetManager.loadAssets([
      { type: 'image', path: 'vrum.png' },
    ], function () {
      Engine.switchScene(Hodler.get('mainScene'))
    })
  }
}

var loadingScene = new LoadingScene()
var mainScene = new MainScene()
Hodler.add('mainScene', mainScene)

Engine.start(loadingScene)

let camera = Hodler.get('camera');
camera.position.set(0, 0, 10)
camera.lookAt(new THREE.Vector3(0,0,0))
