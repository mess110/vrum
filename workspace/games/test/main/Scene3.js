class Scene3 extends Scene {
  init(options) {
    resetCamPosition(10)

    this.terrain = Terrain.fromJson(AssetManager.get('terrain.json'))
    this.terrain.position.set(0, -1, 0)
    this.add(this.terrain)

    this.add(new THREE.AmbientLight())
    Utils.toggleOrbitControls()

    let mesh = AssetManager.clone('chicken.gltf')
    mesh.scale.setScalar(5)
    this.add(mesh)
    this.chicken = mesh

    this.velY = 0
    this.velX = 0
    this.speed = 2
    this.acceleration = 1
    this.friction = 1 // 0.98
    this.keys = []

    this.raycaster = new THREE.Raycaster()
    this.direction = new THREE.Vector3(0, -1, 0)

    let geometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 )
    let material = new THREE.MeshBasicMaterial( { color: 0x4d4d4d } )
    let cube = new THREE.Mesh( geometry, material )
    this.add(cube)
    this.point = cube
  }

  tick(tpf) {
    let velY = this.velY
    let velX = this.velX
    let speed = this.speed
    let friction = this.friction
    let acceleration = this.acceleration
    let keys = this.keys

    if (keys[38]) {
        if (velY > -speed) {
            velY -= tpf * acceleration
        }
    }

    if (keys[40]) {
        if (velY < speed) {
            velY += tpf * acceleration
        }
    }
    if (keys[39]) {
        if (velX < speed) {
            velX += tpf * acceleration
        }
    }
    if (keys[37]) {
        if (velX > -speed) {
            velX -= tpf * acceleration
        }
    }

    let y = this.chicken.position.z
    let x = this.chicken.position.x

    velY *= friction;
    y += velY;
    velX *= friction;
    x += velX;

    this.chicken.position.x = x
    this.chicken.position.z = y

    // let fromPosition = this.point.position.clone()
    // fromPosition.y = 5
    // let intersection = this.inter(this.raycaster, fromPosition, this.direction, this.terrain)
    // if (!isBlank(intersection)) {
      // this.line(fromPosition, intersection.point)
      // this.chicken.position.y = intersection.point.y
    // }
  }

  doMouseEvent(event, raycaster) {
    if (event.type != 'mousedown') { return }
    let intersection = Measure.intersects(raycaster, this.terrain)
    if (!isBlank(intersection)) {
      Measure.clearLines()
      let scene = Hodler.get('scene')
      scene.point.position.set(intersection.point.x, intersection.point.y, intersection.point.z)
      Measure.addLineBetween(scene.chicken.position, intersection.point)
      console.log(Measure.distanceBetween(scene.chicken.position, intersection.point))
      Measure.addLineDirection(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1, 0, 0))
    }
  }

  uninit() {
    Utils.toggleOrbitControls()
  }

  doKeyboardEvent(event) {
    switchScene(event)
    this.keys[event.keyCode] = event.type == "keydown"
  }
}
