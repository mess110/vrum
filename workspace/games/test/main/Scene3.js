class Scene3 extends Scene {
  init(options) {
    let camera = resetCamPosition(20)
    camera.position.set(0, 0, 20)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // Utils.toggleOrbitControls()
    this.add(new THREE.AmbientLight())
    this.add(new Sky())

    let geometry = new THREE.BoxGeometry( 1, 1, 1 )
    let material = new THREE.MeshBasicMaterial( { color: 0x4d4d4d } )
    let cube = new THREE.Mesh( geometry, material )
    this.add(cube)
    this.cube = cube

    let control = new PositionXZRotationYControls()
    this.control = control
  }

  uninit() {
    // Utils.toggleOrbitControls()
  }

  tick(tpf) {
    this.control.tick(tpf)

    this.cube.position.x += this.control.velocity.x
    this.cube.position.y -= this.control.velocity.z
  }

  doKeyboardEvent(event) {
    switchScene(event)
    this.control.doKeyboardEvent(event)
  }

  doGamepadEvent(event, gamepadIndex) {
    this.control.doGamepadEvent(event, gamepadIndex)
  }
}
