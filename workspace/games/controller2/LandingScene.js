class LandingScene extends Scene {
  init(options) {
    let buttons = []
    this.buttons = buttons

    let camera = Hodler.get('camera')
    camera.position.set(0, 0, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.add(new THREE.AmbientLight())

    let button1 = new Button3D('scan qr')
    button1.position.set(0, 1.5, 0)
    button1.onClick = () => {
      window.location.href = `zxing://scan/?ret=${window.location.href}?room={CODE}`
    }
    this.add(button1)
    buttons.push(button1)

    let button2 = new Button3D('join')
    button2.onClick = () => {
      console.log('switch to join scene')
    }
    button2.position.set(0, -1.5, 0)
    this.add(button2)
    buttons.push(button2)
  }

  tick(tpf) {
    this.buttons.forEach((button) => {
      button.tick(tpf)
    })
  }

  doMouseEvent(event, raycaster) {
    this.buttons.forEach((button) => {
      button.doMouseEvent(event, raycaster)
    })
  }
}
