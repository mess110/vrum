class GameScene extends Scene {
  init(options) {
    console.log(`Shortcuts:

  all modes:

    , to open a scene
    . to save a scene
    / load asset
    t toggle shadow helpers
    y toggle grid

  navigation mode:

    left mouse button to rotate
    right mouse button to pan
    scroll to zoom

  tranform mode:

    left mouse button to select item
    right mouse button to deselect

    a - add an item
    x - delete item

    g - position
    r - rotation
    s - scale
`)
    let camera = this.getCamera()
    camera.position.set(0, 10, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.keyboard = Hodler.get('engine').inputManager.keyboard
    this.cinematic = Hodler.get('cinematic')
    this.basePath = '/workspace/assets/'

    let orbit = Utils.toggleOrbitControls()

    let control = new THREE.TransformControls( camera, Hodler.get('renderer').domElement );
    control.addEventListener( 'dragging-changed', function ( event ) {
      orbit.enabled = ! event.value;
    })
    this.control = control
    this.orbit = orbit
    this.attached = undefined

    this.grid = new THREE.GridHelper( 1000, 100 )
    this.add(this.grid);

    this.cinematic.addToScene()
  }

  uninit() {
    Utils.toggleOrbitControls()
  }

  tick(tpf) {
  }

  attachTo(mesh) {
    if (!isBlank(this.attached)) { this.detach() }
    this.attached = mesh
    this.control.attach(this.attached)
    this.add(this.control)
  }

  detach() {
    if (isBlank(this.attached)) { return }
    this.control.detach(this.attached)
    this.attached = undefined
  }

  removeItem() {
    if (isBlank(this.attached)) {
      console.warn('can not delete: no item selected')
      return
    }
    let scene = Hodler.get('scene')
    let cinematic = Hodler.get('cinematic')

    cinematic.removeItemByModel(this.attached)
    scene.remove(this.attached)
    this.detach()
  }

  newModel(asset) {
    let scene = Hodler.get('scene')
    let cinematic = Hodler.get('cinematic')
    let item;

    if (['model', 'json'].includes(asset.type)) {
      let assetKey = AssetManager.getAssetKey(asset)
      item = { key: assetKey, type: asset.type, position: { x: 0, y: 0, z: 0}, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1} }
    } else if (['water', 'sky', 'directionalLight', 'ambientLight', 'pointLight', 'hemisphereLight'].includes(asset.type)) {
      item = asset
    } else {
      console.error(`dunno what to doooo with ${asset.type}`)
      return
    }

    let added = cinematic.addItem(item)
    if (added) {
      cinematic.json.items.push(item)
      scene.hideAddItemPanel()
    }
  }

  showAddItemPanel() {
    let addItemsPanel = document.querySelector('#add-items')
    addItemsPanel.style.display = ''

    let assetPanel = document.querySelector('#asset-panel')
    assetPanel.innerHTML = ''

    Hodler.get('cinematic').getAssets().forEach((asset) => {
      if (['font', 'image', 'sound'].includes(asset.type)) {
        return
      }

      let assetKey = AssetManager.getAssetKey(asset)
      let assetRow = this.makeMenuRow(asset.type, assetKey, asset)
      assetPanel.append(assetRow)
    })

    let color = 'white'

    let ambientLightRow = this.makeMenuRow('light', 'ambient', { type: 'ambientLight', color: color, intensity: 1.0 })
    assetPanel.append(ambientLightRow)

    let directionalLightRow = this.makeMenuRow('light', 'directional', { type: 'directionalLight', color: color, intensity: 1.0, position: { x: 0, y: 0, z: 0}, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1} })
    assetPanel.append(directionalLightRow)

    let pointLightRow = this.makeMenuRow('light', 'point', { type: 'pointLight', color: color, intensity: 1.0, distance: 0, decay: 1, position: { x: 0, y: 0, z: 0} })
    assetPanel.append(pointLightRow)

    let hemisphereLightRow = this.makeMenuRow('light', 'hemisphere', { type: 'hemisphereLight', skyColor: color, groundColor: 'white', intensity: 1.0 })
    assetPanel.append(hemisphereLightRow)

    let skyRow = this.makeMenuRow('sky', 'sky', { type: 'sky', distance: 400, inclination: 0.4, azimuth: 0.205 })
    assetPanel.append(skyRow)

    let waterRow = this.makeMenuRow('water', 'water', { type: 'water', map: 'waternormals.jpg', width: 9, height: 9, water: { alpha: 0.8 }, position: { x: 0, y: 0, z: 0}, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1} })
    assetPanel.append(waterRow)
  }

  makeMenuRow(icon, label, obj) {
    let ambientLightIconSpan = document.createElement('span')
    ambientLightIconSpan.innerHTML = `${icon} - `

    let ambientLightNameSpan = document.createElement('span')
    ambientLightNameSpan.innerHTML = label

    let ambientLightRow = document.createElement('p')
    ambientLightRow.addEventListener('click', (event) => {
      if (obj.type == 'water') {
        Utils.loadDependencies(this.basePath, 'textures/waternormals.jpg', (asset) => {
          this.cinematic.addAsset(asset)
        })
      }
      let scene = Hodler.get('scene')
      scene.newModel(obj)
    })
    ambientLightRow.appendChild(ambientLightIconSpan)
    ambientLightRow.appendChild(ambientLightNameSpan)

    return ambientLightRow
  }

  hideAddItemPanel() {
    let addItemsPanel = document.querySelector('#add-items')
    addItemsPanel.style.display = 'none'
  }

  doMouseEvent(event, raycaster) {
    // console.log(`${event.type} ${event.which} ${event.x}:${event.y} ${event.wheelDelta}`)

    if (event.which == 3) { // right mouse button
        this.detach()
        this.hideAddItemPanel()
        return
    }

    if (event.type == 'mousedown' && isBlank(this.attached)) {
      let intersects = raycaster.intersectObjects( this.cinematic.getAssetModels(), true );
      if (intersects.any()) {
        let intersection = intersects.first()
        this.cinematic.getAssetModels().forEach((asset) => {
          asset.traverse((child) => {
            if (child.uuid == intersection.object.uuid) {
              this.attachTo(asset)
            }
          })
        })
      }
    }
  }

  doKeyboardEvent(event) {
    if (event.type != 'keydown') { return }

    if (event.code == 'Comma') {
      document.querySelector('#scene-input').click()
      return
    }

    // if (this.keyboard.pressed('ctrl+s')) {
    if (event.code == 'Period') {
      Utils.saveFile(this.cinematic.toJSON(), 'scene.json')
      return
    }

    if (event.code == 'KeyR') {
      this.control.setMode( "rotate" );
    }
    if (event.code == 'KeyG') {
      this.control.setMode( "translate" );
    }
    if (event.code == 'KeyS') {
      this.control.setMode( "scale" );
    }
    if (event.code == 'KeyA') {
      this.showAddItemPanel()
    }
    if (event.code == 'KeyX') {
      this.removeItem()
    }
    if (event.code == 'KeyT') {
      Utils.toggleShadowCameraHelpers()
    }
    if (event.code == 'KeyY') {
      this.grid.visible = !this.grid.visible
    }
    if (event.code == 'Escape') {
      this.hideAddItemPanel()
    }
    if (event.code == 'Slash') {
      this.hideAddItemPanel()
      let assetFolderAndName = prompt(`Load asset from ${this.basePath}`);
      Utils.loadDependencies(this.basePath, assetFolderAndName, (asset) => {
        this.cinematic.addAsset(asset)
      })
    }
    console.log(`${event.type} ${event.code} (${event.which})`)
  }
}
