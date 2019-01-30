class MainScene extends Scene {
  init(options) {
    this.add(new THREE.AmbientLight(0xffffff))

    this.model = Utils.plane({ map: 'vrum.png', width: 6.4, height: 3.65 })
    this.add(this.model)
  }

  doMouseEvent(event, raycaster) {
    console.log(`${event.type} ${event.which} ${event.x}:${event.y} ${event.wheelDelta}`)
  }

  doKeyboardEvent(event) {
    console.log(`${event.type} ${event.code} (${event.which})`)
  }
}

class LoadingScene extends MainScene {
  init(options) {
    let camera = this.getCamera()
    camera.position.set(0, 0, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    let geometry = new THREE.BoxGeometry( 1, 1, 1 )
    let material = new THREE.MeshBasicMaterial({ color: 'red' })
    this.model = new THREE.Mesh(geometry, material)
    this.add(this.model)

    AssetManager.loadAssets([
      { type: 'image', path: 'vrum.png' },
    ], function () {
      let mainScene = new MainScene()
      Engine.switchScene(mainScene)
    })
  }

  tick(tpf) {
    this.model.rotation.x += tpf / 2
    this.model.rotation.y += tpf / 2
  }
}

let loadingScene = new LoadingScene()
Engine.start(loadingScene)
