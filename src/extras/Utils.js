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

  static toggleShadows() {
    let renderer = Hodler.get('renderer')
    renderer.shadowMap.enabled = !renderer.shadowMap.enabled
    renderer.shadowMap.soft = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.shadowMap.autoUpdate = true

    let scene = Hodler.get('scene')
    scene.traverse((obj) => {
      if (obj instanceof SpotLight) {
        obj.spotLight.castShadow = !obj.spotLight.castShadow
      }
      if (obj instanceof Sky) {
        obj.light.castShadow = !obj.light.castShadow
      }
    })
  }

  static toggleShadowCameraHelpers() {
    let scene = Hodler.get('scene')
    scene.traverse((obj) => {
      if (obj instanceof SpotLight || obj instanceof Sky) {
        obj.cameraHelper.visible = !obj.cameraHelper.visible
      }
    })
  }

  static webgl() {
    return WEBGL.isWebGLAvailable()
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

  // Creates a plane
  //
  // @param [Object] options
  static plane(options) {
    let material;
    if (options == null) { options = {}; }
    if (options.size != null) {
      options.width = options.size;
      options.height = options.size;
    } else {
      if (options.width == null) { options.width = Utils.PLANE_DEFAULT_WIDTH; }
      if (options.height == null) { options.height = Utils.PLANE_DEFAULT_HEIGHT; }
    }
    if (options.wSegments == null) { options.wSegments = Utils.PLANE_DEFAULT_W_SEGMENTS; }
    if (options.hSegments == null) { options.hSegments = Utils.PLANE_DEFAULT_H_SEGMENTS; }
    if (options.color == null) { options.color = Utils.PLANE_DEFAULT_COLOR; }
    if (options.class == null) { options.class = 'PlaneBufferGeometry'; }

    if (options.map != null) {
      material = new (THREE.MeshBasicMaterial)({
        map: AssetManager.get(options.map),
        side: THREE.DoubleSide});
    } else if (options.material != null) {
      material = options.material
    } else {
      material = new (THREE.MeshBasicMaterial)({
        color: options.color,
        side: THREE.DoubleSide});
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

  // orbit.maxPolarAngle = Math.PI * 0.495
  static toggleOrbitControls() {
    var orbitControls = Hodler.get('orbitControls')
    if (orbitControls !== null && orbitControls !== undefined) {
      orbitControls.dispose()
      Hodler.add('orbitControls', undefined)
    } else {
      var camera = Hodler.get('camera')
      var renderer = Hodler.get('renderer')

      var orbitControls = new (THREE.OrbitControls)(camera, renderer.domElement)
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
    img.src = 'data:image/png;base64,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';
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

    window._ceOutput = 'coffee-engine console >';

    console.log = function(message) {
      window._ceOutput += `\n${message}`;
      const html = document.querySelector('.ce-console-text');
      if (html != null) {
        html.innerHTML = window._ceOutput;
        html.scrollTop = html.scrollHeight;
      }
      window._log.apply(console, arguments);
    };

    console.info = function(message) {
      window._ceOutput += `\n${message}`;
      const html = document.querySelector('.ce-console-text');
      if (html != null) {
        html.innerHTML = window._ceOutput;
        html.scrollTop = html.scrollHeight;
      }
      window._info.apply(console, arguments);
    };

    console.warn = function(message) {
      window._ceOutput += `\n${message}`;
      const html = document.querySelector('.ce-console-text');
      if (html != null) {
        html.innerHTML = window._ceOutput;
        html.scrollTop = html.scrollHeight;
      }
      window._warn.apply(console, arguments);
    };

    return console.error = function(message) {
      window._ceOutput += `\n${message}`;
      const html = document.querySelector('.ce-console-text');
      if (html != null) {
        html.innerHTML = window._ceOutput;
        html.scrollTop = html.scrollHeight;
      }
      window._error.apply(console, arguments);
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
Utils.CE_UI_Z_INDEX = 1000;
Utils.ORIENTATIONS = ['all', 'landscape', 'portrait'];
Utils.FADE_COLOR = 'black';
Utils.FADE_DEFAULT_DURATION = 1000;
Utils.PHYSICS = {
  DISABLE_DEACTIVATION: 4
};

