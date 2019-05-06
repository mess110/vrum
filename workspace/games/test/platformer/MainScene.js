class MainScene extends Scene {
  init(options) {
    let camera = this.getCamera()
    camera.position.set(0, 0, 20)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // Utils.toggleOrbitControls()
    this.add(new THREE.AmbientLight())
    this.add(new Sky())

    let statsPanel = new StatsPanel()
    this.add(statsPanel)

    let groundColor = 0x00dd00
    let geometryG = new THREE.BoxGeometry( 15, 1, 1 )
    let materialG = new THREE.MeshBasicMaterial( { color: groundColor } )
    let ground = new THREE.Mesh( geometryG, materialG )
    ground.position.set(0, -1, 0)

    let geometryI1 = new THREE.BoxGeometry( 7.5, 1, 1 )
    let materialI1 = new THREE.MeshBasicMaterial( { color: groundColor } )
    let island1 = new THREE.Mesh( geometryI1, materialI1 )
    island1.position.set(-9, 2, 0)
    this.add(island1)

    let geometryI2 = new THREE.BoxGeometry( 7.5, 1, 1 )
    let materialI2 = new THREE.MeshBasicMaterial( { color: groundColor } )
    let island2 = new THREE.Mesh( geometryI2, materialI2 )
    island2.position.set(9, 3, 0)
    this.add(island2)

    let geometryI3 = new THREE.BoxGeometry( 1, 1, 1 )
    let materialI3 = new THREE.MeshBasicMaterial( { color: groundColor } )
    let island3 = new THREE.Mesh( geometryI3, materialI3 )
    island3.position.set(3, 0, 0)
    this.add(island3)

    this.add(ground)
    this.ground = ground

    let rayscanner = new RayScanner([ground, island1, island2, island3])
    // rayscanner.drawLines = true
    rayscanner.lineLength = 0.5
    this.rayscanner = rayscanner

    this.controls = new PlatformerControls()

    let geometry = new THREE.BoxGeometry( 1, 1, 1 )
    let material = new THREE.MeshBasicMaterial( { color: 0x4d4d4d } )
    let cube = new THREE.Mesh( geometry, material )
    cube.position.set(0, 3, 0)
    this.add(cube)
    this.cube = cube
  }

  uninit() {
    // Utils.toggleOrbitControls()
  }

  tick(tpf) {
    Measure.clearLines()

    this.controls.tick(tpf)

    let cube = this.cube
    let fromPosition = cube.position.clone()

    fromPosition.x += this.controls.velocity.x * tpf
    fromPosition.y += this.controls.velocity.y * tpf

    let beneath = this.rayscanner.scanEdgesBottom(fromPosition, 0.5)
    if (beneath.any() && this.controls.velocity.y < 0) {
      this.controls.land()
      cube.position.y = beneath.first().object.position.y + 1
    }

    let hasOnRight = this.rayscanner.getIntersects(fromPosition, new THREE.Vector3(1, 0, 0)).any()
    if (hasOnRight) {
      this.controls.velocity.x = 0
    }
    if (this.controls.velocity.x > 0 && !hasOnRight) {
      cube.position.x += this.controls.velocity.x * tpf
    }

    let hasOnLeft = this.rayscanner.getIntersects(fromPosition, new THREE.Vector3(-1, 0, 0)).any()
    if (hasOnLeft) {
      this.controls.velocity.x = 0
    }
    if (this.controls.velocity.x < 0 && !hasOnLeft) {
      cube.position.x += this.controls.velocity.x * tpf
    }
    cube.position.y += this.controls.velocity.y * tpf

    if (cube.position.y < -10) {
      cube.position.set(0, 20, 0)
    }
  }

  doKeyboardEvent(event) {
    this.controls.doKeyboardEvent(event)
  }
}
