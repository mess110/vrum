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

    this.connectedGamepads = 0
    this.lastVibration = 0

    let text = new BaseText({
      text: '0 connected', fillStyle: 'gray',
      canvasW: 1024, canvasH: 1024,
      font: '64px luckiest-guy'})
    text.position.set(0, 0, 4)
    text.scale.set(5, 5, 5)
    text.lookAt(camera.position)
    this.text = text
    this.add(text)
  }

  tick(tpf) {
    this.text.setText(`${this.connectedGamepads} connected`)
  }

  vibrate(gamepad) {
    if (this.lastVibration + 2 > this.uptime) { return }
    this.lastVibration = this.uptime
    gamepad.vibrationActuator.playEffect("dual-rumble", {
      startDelay: 0,
      duration: 1000,
      weakMagnitude: 1.0,
      strongMagnitude: 1.0
    });
  }

  // event looks like
  //
  // [
  //   type: 'gamepadtick-vrum
  //   {
  //     axes: [0.01, 0.01, 0.02, 0.04],
  //     buttons: [
  //       { pressed: true, value: 1 },
  //       { pressed: false, value: 0 },
  //       { pressed: false, value: 0 },
  //       { pressed: false, value: 0 },
  //       [...]
  //     ],
  //     connected: true,
  //     id: "Xbox 360 Controller (XInput STANDARD GAMEPAD)",
  //     index: 0,
  //     mapping: "standard",
  //     timestamp: 177550
  //   },
  //   null,
  //   null,
  //   null
  // ]
  doGamepadEvent(event) {
    // console.log(event.type)
    if (event.type !== 'gamepadtick-vrum') { return }

    let connectedGamepads = 0
    for (var i = 0; i < event.length; i++) {
      let gamepad = event[i]
      if (isBlank(gamepad)) { continue }
      connectedGamepads += 1
      gamepad.axes.forEach((axe, index) => {
        if (index == 0) {
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
          if (index == 0) {
            this.vibrate(gamepad)
          }
        }
      })
    }

    this.connectedGamepads = connectedGamepads
  }
}

// Config.instance.camera.type = 'perspective'
Config.instance.camera.type = 'ortographic'

let gameScene = new GameScene()
Engine.start(gameScene, [
  { type: 'font',  path: '/workspace/assets/fonts/luckiest-guy' },
])
