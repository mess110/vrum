class MainScene extends Scene {
  init(options) {
    this.chicken = AssetManager.get('chicken.json')
    this.chicken.scale.setScalar(4)
    this.add(this.chicken)

    this.chicken.animations[2].play()

    this.add(new THREE.AmbientLight(0xffffff))
  }
}

class LoadingScene extends MainScene {
  init(options) {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 )
    var material = new THREE.MeshBasicMaterial({ color: 'red' })
    this.cube = new THREE.Mesh(geometry, material)
    this.add(this.cube)

    AssetManager.loadAssets([
      { type: 'model', path: '/workspace/assets/models/chicken.json' },
      { type: 'image', path: '/workspace/assets/models/chicken.png' },
    ], function () {
      Engine.switchScene(Hodler.get('mainScene'))
    })
  }

  tick(tpf) {
    this.cube.rotation.x += tpf
    this.cube.rotation.y += tpf
  }
}

var loadingScene = new LoadingScene()
var mainScene = new MainScene()
Hodler.add('mainScene', mainScene)

Engine.start(loadingScene)

let camera = Hodler.get('camera');
camera.position.set(0, 0, 7)
camera.lookAt(new THREE.Vector3(0,0,0))
