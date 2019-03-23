class SceneLoader {
  constructor(json) {
    if (isBlank(json)) {
      json = {}
    }
    this.json = json
    this.actionHistory = []

    this.setDefaultValues()
  }

  setDefaultValues() {
    let json = this.json
    if (isBlank(json.assets)) { json.assets = [] }
    if (isBlank(json.items)) { json.items = [] }
  }

  addToScene() {
    let that = this
    this.getItems().forEach((item) => {
      that.addItem(item)
    })
  }

  addItem(item) {
    let scene = Hodler.get('scene')
    let model

    if (item.type == 'model') {
      model = AssetManager.clone(item.key)
    } else if (item.type == 'ambientLight') {
      model = new THREE.AmbientLight(item.color, item.intensity)
    } else if (item.type == 'directionalLight') {
      model = new THREE.DirectionalLight(item.color, item.intensity)
    } else if (item.type == 'pointLight') {
      model = new THREE.PointLight(item.color, item.intensity, item.distance, item.decay)
    } else if (item.type == 'hemisphereLight') {
      model = new THREE.HemisphereLight(item.skyColor, item.groundColor, item.intensity)
    } else if (item.type == 'sky') {
      model = new Sky()
      model.updateSun(item.distance, item.inclination, item.azimuth)
    } else if (item.type == 'water') {
      model = new Water(item)
    } else if (item.type == 'json') {
      let json = AssetManager.get(item.key)
      if (isBlank(json.kind)) {
        console.error(`missing kind for ${item.key}`)
        return false
      }
      if (json.kind === 'graffiti') {
        model = Utils.graffiti(json)
      } else if (json.kind === 'particle') {
        console.error("Particles can only be loaded, not added")
        return false
      } else if (json.kind === 'shader') {
        console.error("Shaders can only be loaded, not added")
        return false
      } else if (json.kind === 'terrain') {
        model = Terrain.fromJson(json)
      } else {
        console.error(`unknown kind ${json.kind} for ${item.key}`)
      }
    } else {
      console.error('model not defined')
      return false
    }

    if (!isBlank(item.position)) {
      model.position.set(item.position.x, item.position.y, item.position.z)
    }
    if (!isBlank(item.rotation)) {
      model.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z)
    }
    if (!isBlank(item.scale)) {
      model.scale.set(item.scale.x, item.scale.y, item.scale.z)
    }

    item.uuid = model.uuid
    if (typeof(model.addToScene) === 'function') {
      model.addToScene(scene)
    } else {
      scene.add(model)
    }

    return true
  }

  toJSON() {
    this.getItems().forEach((item) => {
      Hodler.get('scene').traverse((model) => {
        if (model.uuid == item.uuid) {
          if (!isBlank(item.position)) {
            item.position = model.position
          }
          if (!isBlank(item.rotation)) {
            item.rotation = {
              x: model.rotation._x,
              y: model.rotation._y,
              z: model.rotation._z
            }
          }
          if (!isBlank(item.scale)) {
            item.scale = model.scale
          }
          delete item.uuid
        }
      })
    })
    return this.json
  }

  getAssetModels() {
    let models = []
    this.getItems().forEach((item) => {
      Hodler.get('scene').traverse((model) => {
        if (item.uuid == model.uuid) {
          models.push(model)
        }
      })
    })
    return models
  }

  removeItemByModel(model) {
    this.getItems().forEach((item) => {
      if (item.uuid == model.uuid) {
        this.json.items.remove(item)
      }
    })
  }

  getAssets() {
    return this.json.assets
  }

  addAsset(asset) {
    this.json.assets.push(asset)
  }

  getItems() {
    return this.json.items
  }
}
