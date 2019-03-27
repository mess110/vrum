class Utils {
  // This is here more as a reminder you can pass params to setTimeout
  static delay(fn, time, ...args) {
    return setTimeout(fn, time, ...Array.from(args))
  }

  // Use JSON to clone an object
  static shallowClone(json) {
    return JSON.parse(JSON.stringify(json));
  }

  // Creates a material from what is drawn on a canvas
  static materialFromCanvas(canvas) {
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    return new THREE.MeshBasicMaterial({map: texture, transparent: true}); // , side: THREE.DoubleSide)
  }

  // Ping the server every 14 seconds so it doesn't close
  static initSandboxPinger() {
    if (typeof window.vrumPinger !== 'undefined') {
      return
    }

    window.vrumPinger = () => {
      fetch("/ping.json").catch((err) => {
        clearInterval(window.vrumPingerInterval)
        alert("sandbox disconnected");
        // hack to allow closing the window
        window.open('','_self').close();
      })
    }

    window.vrumPinger()
    window.vrumPingerInterval = setInterval(window.vrumPinger, 14000)
  }

  static loadDependencies(basePath, assetFolderAndName, callbackMain, callbackDepend) {
    if (isBlank(callbackMain)) { callbackMain = () => {} }
    if (isBlank(callbackDepend)) { callbackDepend = callbackMain }

    let path = `${basePath}${assetFolderAndName}`

    let assetType
    if (isBlank(assetFolderAndName)) { return }
    if (assetFolderAndName.startsWith('textures/')) { assetType = 'image' }
    if (assetFolderAndName.startsWith('models/')) { assetType = 'model' }
    if (assetFolderAndName.startsWith('sounds/')) { assetType = 'sound' }
    if (assetFolderAndName.startsWith('graffiti/')) { assetType = 'json' }
    if (assetFolderAndName.startsWith('particles/')) { assetType = 'json' }
    if (assetFolderAndName.startsWith('shaders/')) { assetType = 'json' }
    if (assetFolderAndName.startsWith('terrains/')) { assetType = 'json' }
    if (isBlank(assetType)) {
      console.error(`unknown asset type ${assetType}`)
      return
    }
    let assetHash = { type: assetType, path: path }
    AssetManager.loadAssets([assetHash], () => {
      // recursively load assets from json models
      let dependentAssets = []
      let assetKey = AssetManager.getAssetKey(assetHash)
      if (assetHash.type == 'json') {
        let json = AssetManager.get(assetKey)
        if (isBlank(json.kind)) {
          console.error(`missing kind for ${assetKey}`)
        } else if (json.kind == 'graffiti') {
          json.items.forEach((item) => {
            if (!isBlank(item.asset)) {
              let newAsset = {
                type: 'image',
                path: item.asset.libPath,
              }
              dependentAssets.push(newAsset)
            }
          })
        } else if (json.kind == 'particle' || json.kind == 'shader') {
          json.textures.forEach((texture) => {
            let newAsset = {
              type: 'image',
              path: texture.libPath
            }
            dependentAssets.push(newAsset)
          })
        } else if (json.kind == 'terrain') {
          dependentAssets.push({ type: 'image', 'path': json.texture.libPath })
          dependentAssets.push({ type: 'image', 'path': json.heightmap.libPath })
        }
        AssetManager.loadAssets(dependentAssets, () => {
          dependentAssets.forEach((dependentAsset) => {
            callbackDepend(dependentAsset)
            // this.cinematic.addAsset(dependentAsset)
          })
        })
      }
      callbackMain(assetHash)
      // this.cinematic.addAsset(assetHash)
    })
  }

  // When back button is pressed, reload the page
  static initPopStateReload() {
    window.onpopstate = (e) => {
      location.reload()
    }
  }

  // https://blog.mozvr.com/cartoon-outline-effect/
  // the lower the thickness the thinner the outline
  static outlineMaterial(color, thickness) {
    if (isBlank(thickness)) { thickness = 0.002 }
    if (isBlank(color)) { color = 'black' }
    const outlineMaterial = new THREE.MeshLambertMaterial({
        color: color, side: THREE.BackSide
    })
    outlineMaterial.onBeforeCompile = (shader) => {
        const token = '#include <begin_vertex>'
        const customTransform = `vec3 transformed = position + objectNormal * ${thickness};`
        shader.vertexShader = shader.vertexShader.replace(token,customTransform)
    }
    outlineMaterial.skinning = true
    return outlineMaterial
  }

  static addOutline(mesh, scalePercent, outlineMaterial) {
    if (isBlank(mesh) || isBlank(mesh.vrumCloneKey)) {
      console.error('can only use addOutline with objects from AssetManager.clone(); try Utils.addMeshOutlineTo instead')
      return mesh
    }
    let outline = AssetManager.clone(mesh.vrumCloneKey)
    Utils.addMeshOutlineTo(mesh, outline, scalePercent, outlineMaterial)
  }

  static addMeshOutlineTo(mesh, meshOutline, scalePercent, outlineMaterial) {
    if (isBlank(mesh)) { throw 'mesh can\'t be blank' }
    if (isBlank(meshOutline)) { throw 'mesh outline can\'t be blank' }
    if (isBlank(scalePercent)) { scalePercent = 3 }
    if (isBlank(outlineMaterial)) {
      outlineMaterial = Utils.outlineMaterial()
    }
    if (isBlank(scalePercent)) { scalePercent = 3 }
    mesh.traverse((obj) => {
      if (obj instanceof THREE.SkinnedMesh) {
        obj.material.side = THREE.FrontSide
      }
    })
    let scale = (mesh.scale.x + mesh.scale.y + mesh.scale.z) / 3
    meshOutline.scale.setScalar(scale + ((scale * scalePercent) / 100))
    meshOutline.position.setScalar(0)
    meshOutline.rotation.set(0, 0, 0)
    meshOutline.traverse((obj) => {
      if (obj instanceof THREE.SkinnedMesh) {
        obj.material = outlineMaterial
        obj.material = AssetManager.updateMaterialAndMap(obj.material)
      }
    })
    mesh.add(meshOutline)
    mesh.outline = meshOutline
  }

  // generate a forest of JsonModelManager
  //
  // @example
  //   node = Helper.forest(
  //     items: [
  //       {
  //         type: 'pinetree', count: 20
  //         scaleMin:
  //           x: 0.5
  //           y: 0.5
  //           z: 0.5
  //         scaleMax:
  //           x: 1.2
  //           y: 1.2
  //           z: 1.2
  //       }
  //     ]
  //     positionMin:
  //       x: 0,
  //       y: 0,
  //       z: 0
  //     positionMax:
  //       x: 2
  //       y: 0
  //       z: 2
  //   )
  //   scene.scene.add node
  static forest(options) {
    if (options == null) { options = {}; }
    if (options.items == null) { options.items = []; }

    if (options.positionMin == null) { options.positionMin = {}; }
    if (options.positionMin.x == null) { options.positionMin.x = 0; }
    if (options.positionMin.y == null) { options.positionMin.y = 0; }
    if (options.positionMin.z == null) { options.positionMin.z = 0; }

    if (options.positionMax == null) { options.positionMax = {}; }
    if (options.positionMax.x == null) { options.positionMax.x = 10; }
    if (options.positionMax.y == null) { options.positionMax.y = 0; }
    if (options.positionMax.z == null) { options.positionMax.z = 10; }

    if (options.rotationMin == null) { options.rotationMin = {}; }
    if (options.rotationMin.x == null) { options.rotationMin.x = 0; }
    if (options.rotationMin.y == null) { options.rotationMin.y = 0; }
    if (options.rotationMin.z == null) { options.rotationMin.z = 0; }

    if (options.rotationMax == null) { options.rotationMax = {}; }
    if (options.rotationMax.x == null) { options.rotationMax.x = 0; }
    if (options.rotationMax.y == null) { options.rotationMax.y = Math.PI; }
    if (options.rotationMax.z == null) { options.rotationMax.z = 0; }

    if (options.scaleMin == null) { options.scaleMin = {}; }
    if (options.scaleMin.x == null) { options.scaleMin.x = 0.5; }
    if (options.scaleMin.y == null) { options.scaleMin.y = 0.5; }
    if (options.scaleMin.z == null) { options.scaleMin.z = 0.5; }

    if (options.scaleMax == null) { options.scaleMax = {}; }
    if (options.scaleMax.x == null) { options.scaleMax.x = 1.5; }
    if (options.scaleMax.y == null) { options.scaleMax.y = 1.5; }
    if (options.scaleMax.z == null) { options.scaleMax.z = 1.5; }

    const node = new THREE.Object3D();

    const coords = function(item, options, attr, coord, which) {
      const s = `${attr}${which}`;
      if ((item[s] != null) && (item[s][coord] != null)) {
        return item[s][coord];
      } else {
        return options[s][coord];
      }
    };

    const singleGeometry = new THREE.Geometry();
    for (let item of Array.from(options.items)) {
      if (item.count == null) { item.count = 1; }
      for (let i = 0, end = item.count, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        const model = AssetManager.clone(item.type);

        for (let attr of ['scale', 'position', 'rotation']) {
          const attrHash = {
            x: Utils.random(coords(item, options, attr, 'x', 'Min'), coords(item, options, attr, 'x', 'Max'), 1000) / 1000,
            y: Utils.random(coords(item, options, attr, 'y', 'Min'), coords(item, options, attr, 'y', 'Max'), 1000) / 1000,
            z: Utils.random(coords(item, options, attr, 'z', 'Min'), coords(item, options, attr, 'z', 'Max'), 1000) / 1000
          };
          model[attr].set(attrHash.x, attrHash.y, attrHash.z);
        }

        node.add(model);
      }
    }
    // model.updateMatrix()
    // singleGeometry.merge(model.geometry, model.matrix)

    // new THREE.Mesh(singleGeometry, mat)
    return node;
  }

  static toggleShadows(shadowMapSize) {
    let renderer = Hodler.get('renderer')
    renderer.shadowMap.enabled = !renderer.shadowMap.enabled
    renderer.shadowMap.soft = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.shadowMap.autoUpdate = true

    let scene = Hodler.get('scene')
    scene.traverse((obj) => {
      let isSpotlight = obj instanceof SpotLight
      let isSky = obj instanceof Sky
      let isLight = obj instanceof THREE.DirectionalLight ||
        obj instanceof THREE.PointLight ||
        obj instanceof THREE.HemisphereLight

      let target
      if (isSpotlight) { target = obj.spotLight }
      if (isSky) { target = obj.light }
      if (isLight) { target = obj }

      if (isLight || isSky || isSpotlight) {
        target.castShadow = !target.castShadow
      }
    })
  }

  // Example usage
  //
  //  Utils.setShadowDetails(512, 512)
  //  Utils.setShadowDetails('low')
  //  Utils.setShadowDetails('medium')
  //  Utils.setShadowDetails('high')
  //  Utils.setShadowDetails('ultra')
  //
  static setShadowDetails(x, y) {
    if (isString(x)) {
      const shadow = Config.instance.shadow.details
      if (x == shadow.low) {
        x = 128
      } else if (x == shadow.medium) {
        x = 512
      } else if (x == shadow.high) {
        x = 1024
      } else if (x == shadow.ultra) {
        x = 2048
      } else {
        throw `invalid shadow detail ${x}`
      }
      y = x
    }
    if (isBlank(x) || isBlank(y)) {
      console.error('missing params')
      return
    }
    let scene = Hodler.get('scene')
    scene.traverse((obj) => {
      let isSpotlight = obj instanceof SpotLight
      let isSky = obj instanceof Sky
      let isLight = obj instanceof THREE.DirectionalLight ||
        obj instanceof THREE.PointLight ||
        obj instanceof THREE.HemisphereLight

      let target
      if (isSpotlight) { target = obj.spotLight }
      if (isSky) { target = obj.light }
      if (isLight) { target = obj }

      if (!isBlank(target)) {
        target.shadow.mapSize.width = x
        target.shadow.mapSize.height = y
      }
    })
  }

  static toggleShadowCameraHelpers() {
    let scene = Hodler.get('scene')
    scene.traverse((obj) => {
      if (obj instanceof SpotLight || obj instanceof Sky) {
        obj.cameraHelper.visible = !obj.cameraHelper.visible
      }
      [
        { type: THREE.DirectionalLight, helper: THREE.DirectionalLightHelper},
        { type: THREE.PointLight, helper: THREE.PointLightHelper},
        { type: THREE.HemisphereLight, helper: THREE.HemisphereLightHelper},
      ].forEach((light) => {
        if (obj instanceof light.type) {
          if (isBlank(obj.cameraHelper)) {
            let helper = new light.helper( obj, 5 );
            obj.cameraHelper = helper
            obj.add(helper)
          } else {
            let helper = obj.cameraHelper
            obj.cameraHelper = undefined
            obj.remove(helper)
          }
        }
      })
    })
  }

  static webgl() {
    return WEBGL.isWebGLAvailable()
  }

  static gamepad() {
    return navigator.getGamepads ? true : (navigator.webkitGamepads ? true : false)
  }

  // Sets the cursor
  //
  // param [String] url of the new cursor
  static setCursor(url) {
    document.body.style.cursor = `url('${url}'), auto`
  }

  // Convert RGB value to Hex
  static rgbToHex(r, g, b) {
    if ((r > 255) || (g > 255) || (b > 255)) { throw "Invalid color component" }
    return ((r << 16) | (g << 8) | b).toString(16)
  }

  static degToRadians(angle) {
    return (angle * Math.PI) / 180
  }

  // An intersection plane
  //
  // @example
  //   @plane = Helper.intersectPlane()
  //   pos = raycaster.ray.intersectPlane(@plane)
  static intersectPlane() {
    return new THREE.Plane(new THREE.Vector3(0, 0, 1), -1);
  }

  static getTextureSize(key, scaleFactor) {
    if (isBlank(scaleFactor)) {
      scaleFactor = Config.instance.ui.addsScene.scaleFactor
    }
    let texture = AssetManager.get(key)
    if (!(texture instanceof THREE.Texture)) {
      throw 'not a texture'
    }
    let params = {
      width: texture.image.width * scaleFactor,
      height: texture.image.height * scaleFactor,
    }
    return params
  }

  // Creates a plane
  //
  // @param [Object] options
  static plane(options) {
    let material;
    if (isBlank(options)) { options = {}; }
    if (options.keepProportions == true && !isBlank(options.map)) {
      let props = Utils.getTextureSize(options.map)
      options.width = props.width
      options.height = props.height
    }
    if (!isBlank(options.size)) {
      options.width = options.size;
      options.height = options.size;
    } else {
      if (isBlank(options.width)) { options.width = Utils.PLANE_DEFAULT_WIDTH; }
      if (isBlank(options.height)) { options.height = Utils.PLANE_DEFAULT_HEIGHT; }
    }
    if (isBlank(options.transparent)) { options.transparent = false }
    if (isBlank(options.side)) { options.side = THREE.DoubleSide }
    if (isBlank(options.opacity)) { options.opacity = 1 }
    if (isBlank(options.wSegments)) { options.wSegments = Utils.PLANE_DEFAULT_W_SEGMENTS; }
    if (isBlank(options.hSegments)) { options.hSegments = Utils.PLANE_DEFAULT_H_SEGMENTS; }
    if (isBlank(options.color)) { options.color = Utils.PLANE_DEFAULT_COLOR; }
    if (isBlank(options.class)) { options.class = 'PlaneBufferGeometry'; }

    if (!isBlank(options.map)) {
      material = new (THREE.MeshBasicMaterial)({
        map: AssetManager.get(options.map),
        transparent: options.transparent,
        opacity: options.opacity,
        side: options.side});
    } else if (!isBlank(options.material)) {
      material = options.material
    } else {
      material = new (THREE.MeshBasicMaterial)({
        color: options.color,
        transparent: options.transparent,
        opacity: options.opacity,
        side: options.side});
    }

    const geometry = new (THREE[options.class])(options.width, options.height, options.wSegments, options.hSegments);
    return new (THREE.Mesh)(geometry, material);
  }


  // Get a random number smaller than n or between min and max
  static random(min, max, mult) {
    if (max == null) {
      max = min;
      min = 0;
    }
    if (mult != null) {
      min *= mult;
      max *= mult;
    }
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
  }

  // Calculate the distance between 2 vectors
  static distanceTo(v1, v2) {
    const dx = v1.x - (v2.x);
    const dy = v1.y - (v2.y);
    const dz = v1.z - (v2.z);
    return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
  }

  static graffiti(json) {
    this.art = new ArtGenerator({width: json.width, height: json.height});
    this.art.fromJson(json);

    let material = this.materialFromCanvas(this.art.canvas);

    const plane = this.plane(json.plane);
    plane.material = material;
    return plane;
  }

  // Create fog
  //
  // @example
  //   scene.fog = Helper.fog('white', 0, 500)
  //
  // @see http://threejs.org/docs/#Reference/Scenes/Fog
  static fog(options){
    if (options == null) { options = {}; }
    if (options.color == null) { options.color = 0x000000; }
    if (options.near == null) { options.near = 0; }
    if (options.far == null) { options.far = 500; }
    return new THREE.Fog(options.color, options.near, options.far);
  }

  // Create a grid
  static grid(options) {
    if (options == null) { options = {}; }
    if (options.size == null) { options.size = 10; }
    if (options.step == null) { options.step = 1; }
    if (options.color == null) { options.color = 0xffffff; }
    if (options.colorCenterLine == null) { options.colorCenterLine = options.color; }
    return new (THREE.GridHelper)(options.size, options.step, options.colorCenterLine, options.color);
  }

  // Generate a random GUID
  //
  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  static old_guid() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }

  static guid() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  static setWireframe(value) {
    Hodler.get('scene').setWireframe(value)
  }

  // adds a script element to the head which loads all font types
  // as long as they are named correctly
  static addFontStyle(path) {
    let name = path.split('/').last()
    let css = `
@font-face {
  font-family: '${name}';
  src: url('${path}.eot');
  src: url('${path}.eot?#iefix') format('embedded-opentype'), url('${path}.woff2') format('woff2'), url('${path}.woff') format('woff'), url('${path}.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
`
    let head = document.head || document.getElementsByTagName('head')[0]
    let style = document.createElement('style')

    style.type = 'text/css';
    if (style.styleSheet){
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }

  static toggleOrbitControls(target) {
    if (![THREE.OrbitControls, THREE.CustomOrbitControls].includes(target)) { target = THREE.OrbitControls }

    var orbitControls = Hodler.get('orbitControls')
    if (orbitControls !== null && orbitControls !== undefined) {
      orbitControls.dispose()
      Hodler.add('orbitControls', undefined)
    } else {
      var camera = Hodler.get('camera')
      var renderer = Hodler.get('renderer')

      var orbitControls = new (target)(camera, renderer.domElement)
      Hodler.add('orbitControls', orbitControls)
    }
    return orbitControls
  }

  static getCenterPoint(mesh) {
    var geometry = mesh.geometry;
    geometry.computeBoundingBox();
    var center = geometry.boundingBox.getCenter();
    mesh.localToWorld( center );
    return center;
  }

  static toggleStereoEffect() {
    var engine = Hodler.get('engine')
    var renderer = Hodler.get('renderer')
    var rendererDefault = Hodler.get('rendererDefault')

    if (renderer instanceof THREE.StereoEffect) {
      Hodler.add('renderer', rendererDefault)
    } else {
      Hodler.add('renderer', engine.renderManager.stereoEffect)
    }
    engine.renderManager.setWidthHeight(rendererDefault.getSize())
  }

  static toggleAnaglyphEffect() {
    var engine = Hodler.get('engine')
    var renderer = Hodler.get('renderer')
    var rendererDefault = Hodler.get('rendererDefault')

    if (renderer instanceof THREE.AnaglyphEffect) {
      Hodler.add('renderer', rendererDefault)
    } else {
      Hodler.add('renderer', engine.renderManager.anaglyphEffect)
    }
    engine.renderManager.setWidthHeight(rendererDefault.getSize())
  }

  static screenshotContents(canvas, withMeta) {
    if (withMeta === null || withMeta === undefined) {
      withMeta = false
    }
    var screenshotData = canvas.toDataURL()
    return withMeta ? screenshotData : screenshotData.split(',')[1]
  }

  // Encrypt object
  //
  // @param [Object] json
  static encrypt(json) {
    const s = JSON.stringify(json);
    return window.btoa(s);
  }

  // Decrypt string into object
  //
  // @param [String] s
  static decrypt(s) {
    return JSON.parse(window.atob(s));
  }

  // Save a file
  //
  // @see https://github.com/carlos-algms/FileSaver.js
  static saveFile(content, fileName, format) {
    if (format == null) { format = "application/json"; }
    Utils._ensureBlobPresence();

    const json = JSON.stringify(content, null, 2);
    const blob = new Blob([json], {type: `${format};charset=utf-8`});
    return saveAs(blob, fileName);
  }

  static screenshot() {
    var engine = Hodler.get('engine')
    engine.takeScreenshot = true
  }

  static saveScreenshot(fileName, withUi) {
    if (fileName == null) { fileName = 'screenshot.png'; }
    if (withUi == null) { withUi = true }
    Utils._ensureBlobPresence();

    if (withUi) {
      html2canvas(document.body).then(canvas => {
        const content = Utils.screenshotContents(canvas)
        saveAs(Utils.base64ToBlob(content), fileName);
      });
    } else {
      var renderer = Hodler.get('renderer')
      const content = Utils.screenshotContents(renderer.domElement)
      saveAs(Utils.base64ToBlob(content), fileName);
    }
  }

  static _ensureBlobPresence() {
    try {
      let isFileSaverSupported;
      return isFileSaverSupported = !!new Blob;
    } catch (e) {
      throw 'FileSaver not supported';
    }
  }

  static base64ToBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    let offset = 0;
    while (offset < byteCharacters.length) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      let i = 0;
      while (i < slice.length) {
        byteNumbers[i] = slice.charCodeAt(i);
        i++;
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  // requires a user action
  static toggleFullscreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) { document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT) }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen() }
    }
  }

  static playVideo(path, callback) {
    if (isBlank(callback)) { callback = () => {} }
    let videoContainerKey = Config.instance.ui.video.containerKey
    if (Hodler.has(videoContainerKey)) {
      console.error('video already playing')
      return
    }
    let supportedFormats = Config.instance.ui.video.supportedFormats
    if (!supportedFormats.includes(path.split('.').last())) {
      throw `unsupported video format for ${path}`
    }
    if (Config.instance.engine.debug) {
      console.info("Playing video")
    }

    let videoContainer = document.createElement("div")
    videoContainer.style.position = 'absolute'
    videoContainer.style.left = 0
    videoContainer.style.top = 0
    videoContainer.style.width = '100%'
    videoContainer.style.height = '100%'
    videoContainer.style.display = 'flex'
    videoContainer.style['z-index'] = Config.instance.ui.zIndex.video
    videoContainer.style['pointer-events'] = 'none'
    Hodler.add(videoContainerKey, videoContainer)

    let video = document.createElement("video")
    video.style.width = '100%'
    video.style.height = 'auto'
    video.style['pointer-events'] = 'none'
    video.setAttribute("src", path);

    videoContainer.appendChild(video)

    video.play()

    video.addEventListener('ended', () => {
      Utils.removeVideo()
      callback()
    },false);

    document.body.appendChild(videoContainer)
  }

  static isPlayingVideo() {
    return Hodler.has(Config.instance.ui.video.containerKey)
  }

  static removeVideo(callback, delay) {
    if (isBlank(callback)) { callback = () => {} }
    if (isBlank(delay)) { delay = Config.instance.fade.duration }

    let videoContainerKey = Config.instance.ui.video.containerKey
    let pendingRemovalKey = Config.instance.ui.video.pendingRemovalKey

    if (Hodler.has(pendingRemovalKey) || !Utils.isPlayingVideo()) {
      return
    }

    if (Config.instance.engine.debug) {
      console.info("Removing video")
    }

    Hodler.add(pendingRemovalKey, 'videoPendingRemoval')

    setTimeout(() => {
      document.body.removeChild(Hodler.get(videoContainerKey))
      Hodler.add(videoContainerKey, undefined)
      Hodler.add(pendingRemovalKey, undefined)
      if (Config.instance.engine.debug) {
        console.info("video tag removed")
      }
      callback()
    }, delay)
  }

  // Fade a scene with a div above it
  // Utils.fade({type: 'in'})}
  // Utils.fade({type: 'out'})}
  static fade(options) {
    let pointerEvents
    if (options == null) { options = {} }
    if (options.duration == null) { options.duration = Config.instance.fade.duration }
    options.duration = options.duration / 1000
    if (options.type == null) { options.type = 'in' }
    if (options.type === 'in') {
      options.opacityFrom = 0
      options.opacityTo = 1
    } else { // out
      options.opacityFrom = 1
      options.opacityTo = 0
    }
    if (options.clickThrough == null) { options.clickThrough = true }

    const existingElement = document.querySelector('.ce-fader')
    if (existingElement != null) {
      document.body.removeChild(existingElement)
      const existingStyle = document.head.querySelector('.ce-fader-style')
      if (existingStyle != null) {
        document.head.removeChild(existingStyle)
      }
    }

    const div = document.createElement('div')
    div.setAttribute('class', 'ce-fader')

    if (options.clickThrough) {
      pointerEvents = '  pointer-events: none;'
    }

    const style = document.createElement('style')
    style.setAttribute('class', 'ce-fader-style')
    style.setAttribute('type', 'text/css')
    style.setAttribute('media', 'all')
    style.innerHTML = `\
.ce-fader { \
position: absolute; \
top: 0px; \
left: 0px; \
width: 100%; \
height: 100%; \
background-color: ${Config.instance.fade.color}; \
z-index: ${Config.instance.ui.zIndex.fade}; \
${pointerEvents} \
\
-webkit-animation: fade-animation ${options.duration}s; /* Safari, Chrome and Opera > 12.1 */ \
-moz-animation: fade-animation ${options.duration}s; /* Firefox < 16 */ \
-ms-animation: fade-animation ${options.duration}s; /* Internet Explorer */ \
-o-animation: fade-animation ${options.duration}s; /* Opera < 12.1 */ \
animation: fade-animation ${options.duration}s; \
} \
\
@keyframes fade-animation { \
from { opacity: ${options.opacityFrom}; } \
to   { opacity: ${options.opacityTo}; } \
} \
\
/* Firefox < 16 */ \
@-moz-keyframes fade-animation { \
from { opacity: ${options.opacityFrom}; } \
to   { opacity: ${options.opacityTo}; } \
} \
\
/* Safari, Chrome and Opera > 12.1 */ \
@-webkit-keyframes fade-animation { \
from { opacity: ${options.opacityFrom}; } \
to   { opacity: ${options.opacityTo}; } \
} \
\
/* Internet Explorer */ \
@-ms-keyframes fade-animation { \
from { opacity: ${options.opacityFrom}; } \
to   { opacity: ${options.opacityTo}; } \
} \
\
/* Opera < 12.1 */ \
@-o-keyframes fade-animation { \
from { opacity: ${options.opacityFrom}; } \
to   { opacity: ${options.opacityTo}; } \
}`;
    document.head.appendChild(style)
    document.body.appendChild(div)

    if (options.opacityTo === 0) {
      const animationEvent = whichAnimationEvent()
      animationEvent && div.addEventListener(animationEvent, function() {
        document.body.removeChild(div)
        document.head.removeChild(style)
      })
    }
  }

  static isMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  static isMobileOrTablet() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  // Allow only one screen orientation
  //
  // Valid orientation types:
  //
  // * all
  // * landscape
  // * portrait
  //
  // @example Utils.orientation('landscape')
  //
  static orientation(orientation) {
    let a1, a2;
    if (orientation == null) { orientation = 'all'; }
    const existingElement = document.querySelector('.ce-turn-screen');
    if (existingElement != null) { document.body.removeChild(existingElement); }
    const existingStyle = document.querySelector('.ce-turn-screen-style');
    if (existingStyle != null) { document.head.removeChild(existingStyle); }
    if (orientation === 'all') { return; }

    const ORIENTATIONS = ['all', 'landscape', 'portrait']
    if (!ORIENTATIONS.includes(orientation)) { throw new Error(`invalid orientation type '${orientation}'`); }

    const div = document.createElement('div');
    div.setAttribute('class', 'ce-turn-screen');
    div.style = `position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: #f0f0f0; z-index: ${Config.instance.ui.zIndex.orientation};`;

    const img = document.createElement('img');
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AYNDy012n9FrgAABkxJREFUeNrt3T1sG+cBgGGTRx3FH5GipADhjyGAg5EgaBa1BWog7dIgY5DFXQLEBRJ4yFI0S7aqyOAtS1B3bBEgWYIMLYJ0MZKxk7yoSzoYgmFRaAtRKgmSIU++6xKgi4eTJYo0+TzzR+l0pxffd+Tx7to1AAAAAAAAAOD/MnbB07Xb7d2HDx/uTvN37OzsJPb0bOzt7aX638/aVU9Xq9V+1263d+2J5SYQkSAQkSAQkSAQkSAQkSAQkSAQkSAQkbCocsv2BzcajReDIHg1CIJXgiBo53K57SAI6kEQbGaz2Vo2m13NZDLhOSK5Nu1P3NN+6svlX52w8IE0m80bKysrb4Rh+Nrq6urNlZWV5hRmkqlHghnk0rRarZ/m8/lbxWLxrTAM21e03BKJQOZ66fRCPp+/XSqV3s3n8zdmdE4iEoHM3RLq5UKh8MHa2trb2Ww2Pwcn7iIRyFyE8VKpVNotl8u3MpmMk1gE8sNSaqtYLH5UqVTey2QywTxt28nJye/NHgKZiXq9ngnD8M76+vrdXC63Pm/bJw6BzHI51a5UKn8qFos/n8ftE4dAZmZ7e/udWq32SRAEa1f1O5MkeZJ2+SYOgcxqSbVaKpXuVavVX1/2zz47OzudTCb7URTtR1G0H8fxQRzHnSRJ/pUkSffo6ChK84msOAQyqyVVo1qt/qVQKPz4Mn5eHMfj4XD4zXg8vh9F0f04jvePjo4udEmCOAQyqzh+tLGx8XUYhq0LLpOS4XD47Wg0+iyKoi87nc5/nXPwXAfSarVubm1tfR0EQfUCs8X3/X7/09Fo9PHh4eF3TshZiECuX7/+i83Nza+CICg/YxiTXq93bzQa3e10Ov+exjaKQyCzmjl+dpE4+v3+F4PB4MPDw8OH09pGcQhkZuccW1tbf3uWOKIo6pyent559OjRV9PcRnEIZFZxNDY2Np7pnKPX630+GAze73Q6p+Jg4QKp1+ur1Wr1r+d9typJkqjb7f7m4ODg3rS3URzMLJByufzHQqGwc57XnJ2d/ef4+PjNx48f/10cLGwg29vb71Qqldvnec1kMnnU7XZfPzw8/OdVbKM4mEkgzWazXavVPjnPa8bj8XfdbveXnU7nsUPGVbrS2/7U6/VMpVL583kuPPxh5hAHix9IGIZ3isXia+c55+h2u6+Lg4UPpNFobK2vr99NOz6O48nx8fGbV3XOATMNpFgsfnSebwKenJz89irerYKZB9JsNl+qVCrvpR3f6/U+Pzg4+IPDw1IEUiqVdtN+Qy+Kos5gMHjfoWEpAmk2my+Xy+Vbacefnp7emfblIzA3gRQKhQ/S3req3+9/Me0LD2FuAmk0Gi+sra29nWZsHMeTwWDwoUPC0gSSz+dvp70daK/XuzfN73PA3AVSKpXeTTl7fD8aje46HCxNIK1W6ydp77Le7/c/ndbXZGEuA8nn879KMy5JkmQ0Gn3sULBUgRSLxbfSjBsOh99O4+4jMLeBNJvNG2mf7DQajT5zGFiqQFZWVt5IeXI+jqLoS4eBpQokDMNUl7QPh8NvLvOOh/BcBLK6unozzbjxeHzfIWCpAmk0Gi+mfdRyFEUCYbkCCYLg1TTjzs7OTuM43ncIWLZAXkkzbjKZXPgRBPA8BpLq7d0oisweLF8guVxuO+US6x92P8s4g9TTjHvy5MmB3c8yBrKZZlySJB27n6ULJJvN1tKMi+PY1bssZSCrKWcQ3ztn+QLJZDJhmnFHR0cju595d+k3r37w4EFgt2IGAYGAQACBgEBAICAQEAgIBAQCAgGBAAIBgYBAQCAgEBAICAQEAgIBgQACAYHA5Ul947idnR0Pu5mR53Hf7+3tZcwgYIkFAgEEAgIBgYBAQCAgEHguXfoj2BblE1SebtmuqDCDgEBAICAQEAgIBAQCAgGBgEAAgYBAQCAgEBAICAQEAgIBgYBAAIGAQEAgIBAQCAgEBAICAYEAAgGBgEBAICAQmDc5u4BpWJRHtZlBQCAgEBAICAQEAgIBgYBAYAn5JJ2p2Nvby5hBwBILBAIIBAQCAgGBgEBAICAQEAgIBBAICAQEAgIBgYBAQCAgEBAICAQQCAgEBAICAYGAQEAgsFAu/e7ui/J8bDCDgEBAICAQEAgIBAQCAgGBAAAAAAAAAADAtf8BFNg15uCjV1oAAAAASUVORK5CYII=';
    const baseStyle = 'position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0;';
    if (orientation === 'landscape') {
      img.style = `${baseStyle}transform: rotate(90deg);`;
      a1 = 'canvas#coffee-engine-dom';
      a2 = '.ce-turn-screen';
    } else {
      img.style = baseStyle;
      a1 = '.ce-turn-screen';
      a2 = 'canvas#coffee-engine-dom';
    }

    const style = document.createElement('style');
    style.setAttribute('class', 'ce-turn-screen-style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('media', 'all');
    style.innerHTML = `\
@media all and (orientation:portrait) { \
${a1} { \
display: none; \
} \
} \
@media all and (orientation:landscape) { \
${a2} { \
display: none; \
} \
}`;
    document.head.appendChild(style);
    div.appendChild(img);
    return document.body.appendChild(div);
  }

  static overrideConsole() {
    window._log = console.log;
    window._warn = console.warn;
    window._info = console.info;
    window._error = console.error;

    window._ceOutput = 'console >';

    let genericLog = (message, which) => {
      window._ceOutput += `\n${message}`
      const html = document.querySelector('.ce-console-text')
      if (html != null) {
        html.innerHTML = window._ceOutput
        html.scrollTop = html.scrollHeight
      }
      window[which].apply(console, arguments)
    }

    console.log = (message) => {
      genericLog(message, '_log')
    };

    console.info = function(message) {
      genericLog(message, '_info')
    };

    console.warn = function(message) {
      genericLog(message, '_warn')
    };

    return console.error = function(message) {
      genericLog(message, '_error')
    };
  }

  // Toggles the console
  static console() {
    if (window._ceOutput == null) { this.overrideConsole(); }

    const existingElement = document.querySelector('.ce-console');
    if (existingElement != null) {
      document.body.removeChild(existingElement);
      const existingStyle = document.head.querySelector('.ce-console-style');
      if (existingStyle != null) {
        document.head.removeChild(existingStyle);
      }
      return false;
    } else {
      const div = document.createElement('div');
      div.setAttribute('class', 'ce-console');

      const divText = document.createElement('div');
      divText.setAttribute('class', 'ce-console-text');
      if (typeof _ceOutput !== 'undefined' && _ceOutput !== null) { divText.innerHTML = _ceOutput; }

      const style = document.createElement('style');
      style.setAttribute('class', 'ce-console-style');
      style.setAttribute('type', 'text/css');
      style.setAttribute('media', 'all');
      style.innerHTML = `\
.ce-console { \
position: absolute; \
top: 0px; \
left: 0px; \
width: 100%; \
z-index: ${Config.instance.ui.zIndex.console}; \
background-color: gray; \
} \
\
.ce-console-text { \
height: 120px; \
padding: 5px; \
overflow-y: scroll; \
white-space: pre; \
color: black; \
}\
`;
      document.head.appendChild(style);
      div.appendChild(divText);
      document.body.appendChild(div);

      return true;
    }
  }
}

Utils.JSON_URLS = ['.json'];
Utils.IMG_URLS = ['.png', '.jpg', '.jpeg'];
Utils.SAVE_URLS = ['.save.json'];
Utils.AUDIO_URLS = ['.mp3', '.ogg', '.wav'];
Utils.CAMERA_DEFAULT_VIEW_ANGLE = 45;
Utils.CAMERA_DEFAULT_NEAR = 1;
Utils.CAMERA_DEFAULT_FAR = 100000;
Utils.CAMERA_DEFAULT_TYPE = 'PerspectiveCamera';
Utils.SKY_SPHERE_DEFAULT_RADIUS = 50000;
Utils.SKY_SPHERE_DEFAULT_SEGMENTS = 64;
Utils.PLANE_DEFAULT_COLOR = '#ff0000';
Utils.PLANE_DEFAULT_WIDTH = 50;
Utils.PLANE_DEFAULT_HEIGHT = 50;
Utils.PLANE_DEFAULT_W_SEGMENTS = 10;
Utils.PLANE_DEFAULT_H_SEGMENTS = 10;
Utils.AMBIENT_LIGHT_DEFAULT_COLOR = '#404040';
Utils.LIGHT_DEFAULT_COLOR = '#ffffff';
Utils.LIGHT_DEFAULT_POSITION_X = 0;
Utils.LIGHT_DEFAULT_POSITION_Y = 100;
Utils.LIGHT_DEFAULT_POSITION_Z = 60;
Utils.POINT_LIGHT_DEFAULT_COLOR = '#ffffff';
Utils.POINT_LIGHT_DEFAULT_INTENSITY = 1;
Utils.POINT_LIGHT_DEFAULT_DISTANCE = 100;
Utils.POINT_LIGHT_DEFAULT_DECAY = 1;
Utils.MIRROR_DEFAULT_COLOR = '#777777';
Utils.MIRROR_DEFAULT_TEXTURE_WIDTH = 512;
Utils.MIRROR_DEFAULT_TEXTURE_HEIGHT = 512;
Utils.MIRROR_DEFAULT_CLIP_BIAS = 0.003;
Utils.MIRROR_DEFAULT_RECURSION = 1
Utils.WATER_DEFAULT_WATER_COLOR = '#001e0f';
Utils.WATER_DEFAULT_ALPHA = 1.0;
Utils.CE_BUTTON_POSITIONS = ['top-right', 'bottom-right', 'top-left', 'bottom-left'];
Utils.CE_BUTTON_TYPES = ['fullscreen', 'reinit'];
Utils.ORIENTATIONS = ['all', 'landscape', 'portrait'];
Utils.FADE_COLOR = 'black';
Utils.FADE_DEFAULT_DURATION = 1000;
Utils.PHYSICS = {
  DISABLE_DEACTIVATION: 4
};

