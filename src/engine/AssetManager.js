class AssetManager {
  constructor() {
    var loadingManager = new THREE.LoadingManager()
    loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
      if (!Config.instance.engine.debug) { return }
      console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' )
    }

    loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      if (!Config.instance.engine.debug) { return }
      console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' )
    }

    loadingManager.onError = function ( url ) {
      console.error( 'There was an error loading ' + url )
    }

    this.loadingManager = loadingManager
    this.jsonLoader = new THREE.JSONLoader(loadingManager)
    this.gltfLoader = new THREE.GLTFLoader(loadingManager)
    this.textureLoader = new THREE.TextureLoader(loadingManager)
    this.data = {}
  }

  static loadAssets(assets, callback) {
    if (isBlank(assets)) { assets = [] }

    if (callback !== undefined && callback !== null) {
      AssetManager.instance.loadingManager.onLoad = () => {
        callback()
      }
    }
    // TODO: check for future key clashes
    let allAssetsAlreadyLoaded = true
    Array.from([].concat(assets)).forEach(function (asset) {
      let isLoading = AssetManager.instance.load(asset)
      if (isLoading) { allAssetsAlreadyLoaded = false }
    })
    if (allAssetsAlreadyLoaded) {
      callback()
    }
  }

  static set(key, value) {
    AssetManager.instance.data[key] = value
  }

  static get(key) {
    if (!this.hasKey(key)) { throw `key ${key} not loaded` }
    return AssetManager.instance.data[key]
  }

  // @nodoc
  // When cloning a SkinnedMesh, three.js doesn't clone the materials so
  // we need to do that
  //
  // TODO: find out if this is still true
  static _hack(mesh) {
    let materials = [];
    if (mesh.material === undefined) {
      return mesh
    }
    for (let mat of Array.from(mesh.material)) {
      let clone = AssetManager.updateMaterialAndMap(mat)
      materials.push(clone);
    }

    mesh.material = materials;
    return mesh;
  }

  static updateMaterialAndMap(material) {
    let clone = material.clone()
    clone.needsUpdate = true
    if (clone.map != null) {
      clone.map = clone.map.clone()
      clone.map.needsUpdate = true
    }
    return clone
  }

  static clone(key) {
    let model = this.get(key)
    let modelType = AssetManager._getModelTypeFromKey(key)
    let target

    if (modelType == 'gltf' || modelType == 'glb') {
      target = cloneGltf(model).scene
      target.traverse((e) => {
        if (typeof e.material !== 'undefined') {
          e.material = AssetManager.updateMaterialAndMap(e.material)
        }
      })
      Animations.init(target, model)
    } else {
      target = model.clone()
      Animations.init(target)
    }
    return this._hack(target)
  }

  static hasKey(key) {
    return key in AssetManager.instance.data
  }

  load(asset) {
    const key = AssetManager.getAssetKey(asset)
    if (key in this.data) {
      console.warn("key " + key + " is already loaded. Skipping")
      // this.loadingManager.onLoad()
      return false
    }
    this.data[key] = null
    switch (asset.type) {
      case 'model':
        this._loadGenericModel(key, asset)
        break;
      case 'image':
        this.loadImage(key, asset.path)
        break;
      case 'sound':
        this.loadSound(key, asset.path)
        break;
      case 'json':
        this.loadJSON(key, asset.path)
        break;
      case 'font':
        this.loadFont(key, asset.path)
        break;
      default:
        throw 'unknown asset type ' + asset.type
    }
    return true
  }

  _loadGenericModel(key, asset) {
    switch (AssetManager._getModelTypeFromKey(key)) {
      case 'json':
        this.loadJSONModel(key, asset.path)
        break
      case 'glb':
        this.loadGLTFModel(key, asset.path)
        break
      case 'gltf':
        this.loadGLTFModel(key, asset.path)
        break
      default:
        throw `unknown model format ${asset.path}`
    }
  }

  static _getModelTypeFromKey(key) {
    return key.split('.').last()
  }

  static getAssetKey(asset) {
    if (isBlank(asset.path)) {
      throw 'missing asset.path'
    }
    return asset.path.split('/').last()
  }

  loadJSONModel(key, value) {
    this.jsonLoader.load(value, function(geometry, materials) {
      var mesh = new THREE.SkinnedMesh(geometry, materials)
      Animations.init(mesh)

      materials.forEach(function (material) {
        material.skinning = true
      })

      AssetManager.set(key, mesh)
    })
  }

  loadFont(key, value) {
    this.loadingManager.itemStart(key)
    let font = new FontFaceObserver(key, {
      weight: 400
    });
    Utils.addFontStyle(value)

    font.load().then(function () {
      AssetManager.set(key, value)
      AssetManager.instance.loadingManager.itemEnd(key)
    }, function () {
      console.error(`Font '${key}' is not available`);
      AssetManager.instance.loadingManager.itemEnd(key)
    });
  }

  loadSound(key, value) {
    this.loadingManager.itemStart(value)
    let howl = new Howl({
      html5: true,
      autoplay: false,
      urls: [value],
      format: [key.split('.').last()],
      onloaderror: function (e) {
        console.error(e)
      },
      onload: function () {
        AssetManager.set(key, howl)
        SoundManager.get().items[key] = howl
        AssetManager.instance.loadingManager.itemEnd(value)
      }
    })
  }

  loadJSON(key, value) {
    this.loadingManager.itemStart(value)
    let request = new XMLHttpRequest;
    request.open('GET', value, true);

    request.onload = function() {
      if ((request.status >= 200) && (request.status < 400)) {
        // Success!
        let data;
        try {
          data = JSON.parse(request.responseText);
        } catch (error) {
          console.log(`invalid json ${value}`);
          return;
        }

        AssetManager.set(key, data)
        AssetManager.instance.loadingManager.itemEnd(value)
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function() {
      console.error(`error loading ${value}`);
    };

    request.send();
  }

  loadGLTFModel(key, value) {
    this.gltfLoader.load(value, function (gltf) {
      // var model = gltf
      // Animations.init(model, gltf)
      // model.skinnedMesh = model.children.first().children.first()
      AssetManager.set(key, gltf)
    })
  }

  loadImage(key, value) {
    this.textureLoader.load(value, function (texture) {
      AssetManager.set(key, texture)
    })
  }
}

AssetManager.instance = new AssetManager()
