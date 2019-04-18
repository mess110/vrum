class ControllerScene extends Scene {
  init(options) {
    this.add(new THREE.AmbientLight(0xffffff))
    this.isPressed = false
    this.connect()
  }

  uninit() {
    if (!VirtualController.isAvailable()) { return }
    if (isBlank(this.vc)) { return }
    this.vc.uninit()
  }

  connect() {
    let mn = MeshNetwork.instance
    if (mn.isConnected()) { return }

    mn.connect('https://mesh.opinie-publica.ro', roomId, {
      cCallback: function () {
        Hodler.get('scene').addControls()
      },
      dcCallback: function () {
        // lost connection with socket.io
      }
    })

    mn.onData = (peer, data) => {}
  }

  getDirection(joystick) {
    let dS = (joystick.right() ? 'right' : '') + (joystick.up() ? 'up' : '') + (joystick.down() ? 'down' : '') + (joystick.left() ? 'left' : '')
    return dS || undefined
  }

  formatJoystick(joystick) {
    return {
      dX: joystick.deltaX(),
      dY: joystick.deltaY(),
      direction: this.getDirection(joystick),
      isPressed: joystick.isPressed
    }
  }

  addControls() {
    this.vc = new VirtualController({
      joystickLeft: {
        stickRadius: 60
      },
      joystickRight: {
        stickRadius: 60
      }
    })
    this.vc.trackIsPressed()

    this.setInterval(function() {
      let scene = Hodler.get('scene')

      let obj = {
        vrumKey: vrumKey,
        type: 'vrum-controller',
        joystickLeft: scene.formatJoystick(scene.vc.joystickLeft),
        joystickRight: scene.formatJoystick(scene.vc.joystickRight)
      }

      MeshNetwork.instance.emit(obj)
    }, 1/30 * 1000);
  }
}
