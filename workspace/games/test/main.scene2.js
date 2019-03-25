class Scene2 extends Scene {
  init(options) {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 )
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
    var cube = new THREE.Mesh( geometry, material )
    this.add(cube)
    this.cube = cube

    var geometry2 = new THREE.BoxGeometry( 1, 1, 1 )
    var material2 = new THREE.MeshBasicMaterial( { color: 0x00ffff } )
    var cube2 = new THREE.Mesh( geometry2, material2 )
    cube2.position.x = 1
    cube.add(cube2)
  }

  tick(tpf) {
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    if (Hodler.get('engine').inputManager.keyboard.pressed('space')) {
      console.log('space pressed')
    }
  }

  doKeyboardEvent(event) {
    switchScene(event)
  }
}
