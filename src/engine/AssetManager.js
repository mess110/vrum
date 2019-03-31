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
    if (!AssetManager.has(key)) { throw `key ${key} not loaded` }
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
      target = AssetManager.cloneGltf(model).scene
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
    target.vrumCloneKey = key
    return this._hack(target)
  }

  static has(key) {
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
    let path
    if (isString(asset)) {
      path = asset
    } else {
      path = asset.path
      if (isBlank(path)) {
        throw 'missing asset.path'
      }
    }
    return path.split('/').last()
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
          AssetManager.set(key, data)
        } catch (error) {
          console.error(`invalid json ${value}`);
        }

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

  static cloneGltf(gltf) {
    const clone = {
      animations: gltf.animations,
      scene: gltf.scene.clone(true)
    };

    const skinnedMeshes = {};

    gltf.scene.traverse(node => {
      if (node.isSkinnedMesh) {
        skinnedMeshes[node.name] = node;
      }
    });

    const cloneBones = {};
    const cloneSkinnedMeshes = {};

    clone.scene.traverse(node => {
      if (node.isBone) {
        cloneBones[node.name] = node;
      }

      if (node.isSkinnedMesh) {
        cloneSkinnedMeshes[node.name] = node;
      }
    });

    for (let name in skinnedMeshes) {
      const skinnedMesh = skinnedMeshes[name];
      const skeleton = skinnedMesh.skeleton;
      const cloneSkinnedMesh = cloneSkinnedMeshes[name];

      const orderedCloneBones = [];

      for (let i = 0; i < skeleton.bones.length; ++i) {
        const cloneBone = cloneBones[skeleton.bones[i].name];
        orderedCloneBones.push(cloneBone);
      }

      cloneSkinnedMesh.bind(
        new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
        cloneSkinnedMesh.matrixWorld);
    }

    return clone;
  }
}

AssetManager.instance = new AssetManager()
