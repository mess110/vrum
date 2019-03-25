class GameScene extends Scene {
  init(options) {
    let camera = this.getCamera()
    camera.position.set(0, 0, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.model = Utils.plane({ map: 'vrum.png', width: 6.4, height: 3.65 })
    this.add(this.model)
  }

  tick(tpf) {
    this.model.rotation.x += tpf / 2
    this.model.rotation.y += tpf / 2
  }

  doMouseEvent(event, raycaster) {
    console.log(`${event.type} ${event.which} ${event.x}:${event.y} ${event.wheelDelta}`)
  }

  doKeyboardEvent(event) {
    console.log(`${event.type} ${event.code} (${event.which})`)
  }
}

let gameScene = new GameScene()

Engine.start(gameScene, [
  { type: 'font', path: 'assets/luckiest-guy' },
  { type: 'image', path: 'assets/vrum.png' },
])
