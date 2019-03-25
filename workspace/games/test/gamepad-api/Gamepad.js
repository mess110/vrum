class GameScene extends Scene {
  init(options) {
    let camera = this.getCamera()
    camera.position.set(0, 30, 30)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.add(new THREE.AmbientLight())

    // returns the same thing
    console.log(`Gamepad support: ${this.gamepadSupported || Utils.gamepad()}`)

    var geometry = new THREE.BoxGeometry( 1, 1, 1 )
    var material = new THREE.MeshBasicMaterial( { color: 0x4d4d4d } )
    var cube = new THREE.Mesh( geometry, material )
    cube.setWireframe(true)
    this.add(cube)
    this.cube = cube
  }

  doGamepadEvent(event) {
    // console.log(event.type)
    if (event.type !== 'gamepadtick-vrum') { return }

    for (var i = 0; i < event.length; i++) {
      let gamepad = event[i]
      if (isBlank(gamepad)) { continue }
      gamepad.axes.forEach((axe, index) => {
        if (index == 0) {
          // console.log(event)
          this.cube.position.x += axe
        } else if (index == 1) {
          this.cube.position.z += axe
        } else if (index == 2) {
          this.cube.rotation.x += axe
        } else if (index == 3) {
          this.cube.rotation.z += axe
        }
      })
      gamepad.buttons.forEach((button, index) => {
        if (button.pressed) {
          console.log(`button index ${index} pressed`)
        }
      })
    }
  }
}

let gameScene = new GameScene()
Engine.start(gameScene, [
])
