class LoadingScene extends MainScene {
  init(options) {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 )
    var material = new THREE.MeshLambertMaterial({ color: 'red' })
    this.model = new THREE.Mesh(geometry, material)
    this.add(this.model)

    var light = new THREE.PointLight(0xFFFFFF, 1, 100)
    light.position.set(0, 10, 10)
    this.add(light)

    AssetManager.loadAssets([
      { type: 'image', path: 'vrum.png' },
    ], function () {
      Engine.switchScene(Hodler.get('mainScene'))
    })
  }

  tick(tpf) {
    this.model.rotation.x += tpf
    this.model.rotation.y += tpf
  }
}

var stopPropagation = function (event) {
  let stopIt = (event) => { event.stopPropagation() }
  document.querySelectorAll('input[type=text]').forEach((e) => {
    e.addEventListener('keydown', stopIt)
  })
}

var loadModel = function (url) {
  let inputUrl = document.querySelector('#inputUrl')
  let scale = parseFloat(document.querySelector('#scale').value)
  if (!isBlank(url)) {
    inputUrl.value = url
  }
  Hodler.get('mainScene').loadModel(inputUrl.value, scale)
  var lastModels = Persist.getJson('lastModels')
  if (!lastModels.includes(inputUrl.value)) {
    lastModels.insert(0, inputUrl.value)
    while (lastModels.size() > 8) {
      lastModels.pop()
    }
    Persist.setJson('lastModels', lastModels)
    updateLastModels()
  }
}

var updateLastModels = () => {
  var lastModels = Persist.getJson('lastModels')
  var element = document.querySelector('#lastModels')
  element.innerHTML = ''

  lastModels.forEach((e) => {
    var button = document.createElement('span')
    button.className = 'button'
    button.setAttribute('onclick', `loadModel('${e}')`)
    button.innerHTML = AssetManager.getAssetKey({ path: e })
    element.append(button)
  })
}

var toggleWireframe = function () {
  wireframe = !wireframe
  Utils.setWireframe(wireframe)
}
