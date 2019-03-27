class Scene2 extends Scene {

  init(options) {
    resetCamPosition(5)
    Utils.toggleOrbitControls()
    this.add(new THREE.AmbientLight())
    this.add(new Sky())

    let outlineMaterial = Utils.outlineMaterial()
    this.outlineMaterial = outlineMaterial

    let geometry = new THREE.BoxGeometry( 1, 1, 1 )
    let material = new THREE.MeshBasicMaterial( { color: 0x4d4d4d } )
    let cube = new THREE.Mesh( geometry, material )

    let outlineCube = new THREE.Mesh( geometry, material)

    Utils.addMeshOutlineTo(cube, outlineCube, 3, outlineMaterial)
    cube.position.y = 2
    this.add(cube)

    let torus = this.torus()
    let torusOutline = this.torus()
    Utils.addMeshOutlineTo(torus, torusOutline, 3, outlineMaterial)
    torus.position.set(-1, 0 ,0)
    this.add(torus)

    let chicken = AssetManager.clone('chicken.gltf')
    Utils.addOutline(chicken, 3, outlineMaterial)
    chicken.position.set(1, 0, 0)
    this.add(chicken)

    chicken.animations.play('walk')

    let bear = AssetManager.clone('panda.glb')
    Utils.addOutline(bear, 3, Utils.outlineMaterial('green', 0.001))
    bear.position.set(3, 0, 0)
    this.add(bear)
  }

  uninit() {
    Utils.toggleOrbitControls()
  }

  torus() {
    let material = new THREE.MeshPhongMaterial({
      color: 'yellow',
      side: THREE.FrontSide
    })
    return new THREE.Mesh(new THREE.TorusKnotBufferGeometry(0.6,0.1), material)
  }

  doKeyboardEvent(event) {
    switchScene(event)
  }
}
