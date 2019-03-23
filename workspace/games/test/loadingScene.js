class LoadingScene extends Scene {
  init(options) {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 )
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
    var cube = new THREE.Mesh( geometry, material )
    this.add(cube)

    let camera = Hodler.get('camera');
    camera.position.set(0, 10, 15)
    camera.lookAt(new THREE.Vector3(0,0,0))

    Engine.switch(Hodler.get('scene4'), [
      { type: 'font',  path: '/workspace/assets/fonts/luckiest-guy' },
      { type: 'model', path: '/workspace/assets/models/chicken.gltf' },
      { type: 'model', path: '/workspace/assets/models/chicken.gltf' },
      { type: 'model', path: '/workspace/assets/models/panda.glb' },
      { type: 'image', path: '/workspace/assets/models/chicken.png' },
      { type: 'image', path: '/workspace/assets/textures/chicken_black.jpeg' },
      { type: 'image', path: '/workspace/assets/textures/hand.png' },
      { type: 'image', path: '/workspace/assets/textures/heightmap3.png' },
      { type: 'image', path: '/workspace/assets/textures/waternormals.jpg' },
      { type: 'image', path: '/workspace/assets/textures/smokeparticle.png' },
      { type: 'image', path: '/workspace/assets/textures/sprite-explosion2.png' },
      { type: 'image', path: '/workspace/assets/textures/black-faded-border.png' },
      { type: 'image', path: '/workspace/assets/textures/vrum.png' },
      { type: 'image', path: '/workspace/assets/textures/grass.png' },
      { type: 'json',  path: '/workspace/assets/particles/particle.json' },
      { type: 'json',  path: '/workspace/assets/graffiti/majestic-frog-cover.json' },
      { type: 'json',  path: '/workspace/assets/shaders/basic_shader.json' },
      { type: 'json',  path: '/workspace/assets/shaders/dissolve_shader.json' },
      { type: 'json',  path: '/workspace/assets/terrains/terrain.json' },
      { type: 'json',  path: '/workspace/assets/scenes/boat-scene.json' },
      { type: 'sound', path: '/workspace/assets/sounds/hit.wav' },
      { type: 'sound', path: '/workspace/assets/sounds/SuperHero_original.ogg' },
    ])
  }
}
