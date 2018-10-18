class MainScene extends Scene {
  init(options) {
    this.add(new THREE.AmbientLight(0xffffff))
    this.model = Utils.plane({ map: 'vrum.png', width: 6.4, height: 3.65 })
    this.add(this.model)

    let shadowMaterial = new THREE.ShadowMaterial({ side: THREE.DoubleSide })
    shadowMaterial.opacity = 0.3
    const plane = Utils.plane({ material: shadowMaterial, size: 100 })
    plane.shadowReceive()
    plane.rotation.x = -Math.PI / 2
    this.add(plane)

    this.add(Utils.grid({ step: 5 }))

    this.sky = new Sky();
    this.sky.addToScene(this)
    this.sky.updateSun(this.sky.distance, 0.1, this.sky.azimuth)

    this.orbit = Utils.toggleOrbitControls()
    this.orbit.enabled = true
    this.orbit.damping = 0.2
    Utils.toggleShadows()

    document.querySelector('#modelControls').style.display = ''
    document.querySelector('#animationControls').style.display = ''
  }

  addModelToScene(path, scale) {
    if (isBlank(scale)) { scale = 1 }

    let scene = Hodler.get('scene')
    scene.remove(scene.model)

    const key = AssetManager.getAssetKey({ path: path })
    let newModel = AssetManager.get(key)
    if (isBlank(newModel)) {
      throw `Asset ${path} with key ${key} is blank`
    }

    newModel.shadowCastAndNotReceive()
    scene.model = newModel
    scene.add(newModel)
    newModel.scale.setScalar(scale)

    // var central = Utils.getCenterPoint(newModel.skinnedMesh)
    // scene.orbit.center.set(central.x, central.y, central.z)

    var animationsHTML = document.querySelector('#animations')
    animationsHTML.innerHTML = ''

    newModel.animations.names().forEach((animationName) => {
      var checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.className = 'stopAllException'
      checkbox.setAttribute('animation', animationName)

      var button = document.createElement('span')
      button.innerHTML = animationName
      button.className = 'button2'
      button.style.padding = '16px'
      button.addEventListener('click', (event) => {
        let loop = document.getElementById('loop').checked
        let reverse = document.getElementById('reverse').checked
        let timeScale = parseFloat(document.getElementById('timeScale').value)
        let stopAll = document.getElementById('stopAll').checked
        let stopAllExceptions = Array.from(document.querySelectorAll('.stopAllException')).filter((e) => { return e.checked }).map((e) => { return e.getAttribute('animation') })
        scene.model.animations.from = animationName
        scene.model.animations.play(animationName, { loop: loop, reverse: reverse, timeScale: timeScale, stopAll: stopAll, stopAllExceptions: stopAllExceptions })
      })

      var p = document.createElement('p')
      p.appendChild(checkbox)
      p.appendChild(button)

      animationsHTML.append(p)
    })
  }

  loadModel(path, scale) {
    AssetManager.loadAssets([
      { type: 'model', path: path },
    ], function () {
      let scene = Hodler.get('scene')
      scene.addModelToScene(path, scale)
    })
  }
}
