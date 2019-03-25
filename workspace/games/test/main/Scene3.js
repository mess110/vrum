class Scene3 extends Scene {
  init(options) {
    resetCamPosition()

    // let mesh = AssetManager.clone('chicken.gltf')
    // this.add(mesh)

    this.add(new THREE.AmbientLight())

    let geometry = new THREE.BoxGeometry( 1, 1, 1 )
    let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
    let cube = new THREE.Mesh( geometry, material )
    this.cube = cube

    let boxHelper = new THREE.BoxHelper(cube);
    this.boxHelper = boxHelper

    // let box3Helper = new THREE.Box3Helper(cube);
    // this.box3Helper = box3Helper

    this.add(this.cube)



    let geometry2 = new THREE.BoxGeometry( 1, 1, 1 )
    let material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
    let cube2 = new THREE.Mesh( geometry2, material2 )
    this.cube2 = cube2
    this.cube2.position.set(3, 0, 0)

    let boxHelper2 = new THREE.BoxHelper(cube2);
    this.boxHelper2 = boxHelper2

    // let box3Helper2 = new THREE.Box3Helper(cube);
    // this.box3Helper2 = box3Helper2

    this.add(this.cube)
    this.add(this.cube2)
    this.add(this.boxHelper)
    this.add(this.boxHelper2)
  }

  tick(tpf) {
    this.cube.position.x += tpf

    this.boxHelper.update()
    this.boxHelper2.update()

    // console.log(this.box3Helper2.intersectsBox(this.box3Helper))

    // console.log(this.boxHelper)
    // console.log(this.boxHelper.isIntersectionBox(this.boxHelper2))
    // console.log(this.boundingBox.object)
    // console.log(this.boundingBox)
    // this.cube2.box.intersectsBox(this.cube.box)
    // this.boundingBox.intersectsBox(this.boundingBox2)
    // this.boundingBox.intersectsBox(this.boundingBox2)

    // let intersects = this.boundingBox2.isIntersectionBox(this.boundingBox)
    // console.log(intersects)
    // if (Hodler.get('engine').inputManager.keyboard.pressed('space')) {
      // console.log('space pressed')
    // }
  }

  doKeyboardEvent(event) {
    switchScene(event)
  }
}
