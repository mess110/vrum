// This is a test scene heavy loaded to use as much features as possible
//
// Testing checklist:
//
// * shadows should be visible
// * you should see a 5x5 white grid
// * a tree changing color should be visible
// * a disolving cube should be visible
//
class FeaturesTest extends Scene {
  init(options) {
    resetCamPosition()

    let dissolveJson = AssetManager.get('dissolve_shader.json')
    var geometry = new THREE.BoxGeometry( 1, 1, 1 )
    var material = new ShaderMaterial(dissolveJson)

    this.cube = new THREE.Mesh( geometry, material )
    this.material = material
    this.cube.position.x = 2
    this.add(this.cube)

    let basicJson = AssetManager.get('basic_shader.json')
    this.treeMaterial = new ShaderMaterial(basicJson, function (tpf) {
      this.uniforms.time.value += tpf * 4
    })

    this.tree = new Tree(this.treeMaterial, 0.1)
    this.add(this.tree)

    var armor = new Box()

    Utils.setCursor('/workspace/assets/textures/hand.png')

    let mesh = AssetManager.clone('chicken.gltf')
    mesh.scale.set(4, 4, 4)
    mesh.position.set(2, 2, -2)
    Utils.addOutline(mesh)
    mesh.shadowCastAndNotReceive()
    mesh.animations.play('die')
    this.add(mesh)

    mesh.attachToBone('chicken-skeleton_Neck', armor)
    mesh.detachFromBone('chicken-skeleton_Neck', armor)
    mesh.attachToBone('chicken-skeleton_Neck', armor, 0.2)

    this.forest = Utils.forest({
      items: [
        {
          type: 'chicken.gltf',
          count: 20,
        }
      ]
    })
    this.forest.position.set(5, -3, -7)
    this.forest.traverse(function (e) {
      if (e instanceof THREE.Scene) {
        e.animations.playRandom()
      }
    })
    this.add(this.forest)

    // this.water = new Water({ map: 'waternormals.jpg', width: 9, height: 9, water: { alpha: 0.8 } })
    // this.water.position.set(9.5, -3, 0)
    // this.add(this.water)

    // this.add(new Starfield())

    this.terrain = Terrain.fromJson(AssetManager.get('terrain.json'))
    this.terrain.shadowReceive()
    this.terrain.position.set(10, -4, 0)
    this.add(this.terrain)

    // this.terrain.material = this.water.water.material

    this.add(new THREE.AmbientLight(0xffffff, 0.3))

    this.sky = new Sky();
    this.sky.addToScene(this)

    this.spotLight = new SpotLight(5, 5, 0)
    this.spotLight.addToScene(this)
    this.spotLight.lookAt(new (THREE.Vector3)(0, 0, 0))

    // let orbit = Utils.toggleOrbitControls()
    // orbit.maxPolarAngle = Math.PI * 0.495;
    this.rtsCam = new RTSCamera()

    this.setInterval(() => {
      PoolManager.spawn(Box)
    }, 1000)


    let jsonParticleData = AssetManager.get('particle.json').particle
    this.explosion = new BaseParticle(jsonParticleData)
    this.explosion.position.set(-30, 0, 0)
    this.add(this.explosion)

    this.art = Utils.graffiti(AssetManager.get('majestic-frog-cover.json'))
    this.art.position.set(-5, 5, 1)
    this.add(this.art)

    this.lightning = new BranchLightning(new (THREE.Vector3)(0, 5, 0), new (THREE.Vector3)(0, 0, 0), 3, 'white', 25, 1)
    this.add(this.lightning)
    this.lightning.strike()

    var planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = 0.2;
    this.plane = Utils.plane({ size: 10, wSegments: 50, hSegments: 50, material: planeMaterial})
    this.plane.shadowReceive()
    this.plane.rotation.x = -Math.PI / 2
    this.add(this.plane)
    // this.plane.setWireframe(true)
    this.add(Utils.grid({ step: 5 }))
    // this.fog = Utils.fog()

    this.mirror = new Mirror({width: 5, height: 5})
    this.mirror.position.set(5, 3, -10)
    this.add(this.mirror)

    var text = new BaseText({
      text: 'hello', fillStyle: 'blue',
      canvasW: 1024, canvasH: 1024,
      font: '128px luckiest-guy'})
    text.position.set(0, 0, 4)
    this.add(text)

    var up = new BaseModifier(text.position, { x: '+1' }, 1000, TWEEN.Easing.Linear.None)
    var down = new BaseModifier(text.position, { x: '-1' }, 1000)
    up.chain(down)
    down.chain(up)
    up.start()

    let duration = 3000
    this.setInterval(() => {
      let fadeOut = new FadeModifier(text, 1, 0.1, duration)
      let fadeIn = new FadeModifier(text, 0.1, 1, duration)
        .delay(duration)
      fadeOut.start()
      fadeIn.start()
    }, duration * 2)

    var panda = AssetManager.clone('panda.glb')
    panda.animations.play(1)
    panda.shadowCastAndNotReceive()
    panda.scale.setScalar(0.2)
    panda.position.set(-3, 0, 3)
    this.add(panda)
    this.panda = panda

    var panda2 = AssetManager.clone('panda.glb')
    panda2.animations.play(1)
    panda2.shadowCastAndNotReceive()
    panda2.scale.setScalar(0.2)
    panda2.position.set(-5, 0, 3)
    panda2.setSkin('chicken_black.jpeg')
    this.add(panda2)

    Utils.toggleShadowCameraHelpers()
    Utils.toggleShadows()

    this.mult = 1
  }

  uninit() {
    Utils.toggleOrbitControls()
    Utils.toggleShadowCameraHelpers()
    Utils.toggleShadows(false)
  }

  tick(tpf) {
    this.rtsCam.tick(tpf)

    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    if (this.sky.inclination == 0.5) {
      this.mult = -1
    }
    if (this.sky.inclination == 0) {
      this.mult = 1
    }
    this.sky.updateSun(this.sky.distance, this.sky.inclination + (tpf / 40 * this.mult), this.sky.azimuth)

    PoolManager.itemsInUse(Box).forEach(function (e) {
      e.position.y -= tpf * 5
      if (e.position.y < 0) {
        PoolManager.release(e)
      }
    })

    // this.lightning.strike()

    this.treeMaterial.tick(tpf)
    this.material.tick(tpf)
  }

  doMouseEvent(event, raycaster) {
    this.rtsCam.doMouseEvent(event)

    if (event.type == 'mousedown') {
      console.log(raycaster.intersectObjects(this.children))
    }
  }

  doKeyboardEvent(event) {
    switchScene(event)
    console.log(`${event.type} ${event.code} (${event.which})`)
    if (event.type == 'keydown' && event.which == 32) {
      SoundManager.play('hit.wav')
    }
  }
}
