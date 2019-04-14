// NOTE: this file is used by the build tool to compile everything into
// one big js file.
//
// Make sure you:
//
//  1. have "" for the DEPENDS you want in the build process
//  2. have '' for the DEPENDS you don't want in the build process
//  3. comma at the end of each DEPEND string or it will be ignored
//
let VRUM_DEPENDS = [
  "/node_modules/three/build/three.js",
  "/node_modules/three/examples/js/WebGL.js",
  "/node_modules/@tweenjs/tween.js/src/Tween.js",
  "/node_modules/howler/howler.js",
  "/node_modules/stats.js/build/stats.js",
  "/node_modules/file-saver/FileSaver.js",
  "/node_modules/html2canvas/dist/html2canvas.js",
  "/node_modules/ccapture.js/build/CCapture.all.min.js",
  "/node_modules/qrcodejs/qrcode.js",
  "/node_modules/fontfaceobserver/fontfaceobserver.standalone.js",
  "/node_modules/camera-controls/dist/camera-controls.js",

  "/node_modules/threex.windowresize/threex.windowresize.js",
  "/node_modules/threex.volumetricspotlight/threex.volumetricspotlightmaterial.js",
  "/node_modules/threex.keyboardstate/threex.keyboardstate.js",
  "/node_modules/virtualjoystick.js/virtualjoystick.js",
  "/node_modules/shader-particle-engine/build/SPE.js",

  "/node_modules/three/examples/js/loaders/GLTFLoader.js",
  "/node_modules/three/examples/js/loaders/deprecated/LegacyJSONLoader.js",

  "/node_modules/three/examples/js/controls/OrbitControls.js",
  "/node_modules/three/examples/js/controls/PointerLockControls.js",
  "/node_modules/three/examples/js/controls/TransformControls.js",

  "/node_modules/three/examples/js/objects/Sky.js",
  "/node_modules/three/examples/js/objects/Reflector.js",

  "/node_modules/three/examples/js/shaders/ConvolutionShader.js",
  "/node_modules/three/examples/js/shaders/CopyShader.js",
  "/node_modules/three/examples/js/shaders/FXAAShader.js",
  "/node_modules/three/examples/js/shaders/FilmShader.js",
  "/node_modules/three/examples/js/shaders/BokehShader.js",
  "/node_modules/three/examples/js/shaders/DigitalGlitch.js",
  "/node_modules/three/examples/js/shaders/LuminosityHighPassShader.js",

  "/node_modules/three/examples/js/postprocessing/EffectComposer.js",
  "/node_modules/three/examples/js/postprocessing/MaskPass.js",
  "/node_modules/three/examples/js/postprocessing/RenderPass.js",
  "/node_modules/three/examples/js/postprocessing/ShaderPass.js",
  "/node_modules/three/examples/js/postprocessing/BloomPass.js",
  "/node_modules/three/examples/js/postprocessing/FilmPass.js",
  "/node_modules/three/examples/js/postprocessing/BokehPass.js",
  "/node_modules/three/examples/js/postprocessing/GlitchPass.js",
  "/node_modules/three/examples/js/postprocessing/UnrealBloomPass.js",
  "/node_modules/three/examples/js/postprocessing/OutlinePass.js",

  "/node_modules/three/examples/js/effects/AnaglyphEffect.js",
  "/node_modules/three/examples/js/effects/StereoEffect.js",

  "../../../src/vendor/threex.dynamictexture.js",
  "../../../src/vendor/threex.rendererstats.js",
  "../../../src/vendor/discoveryClient.js",
  "../../../src/vendor/water-material.js",
  "../../../src/vendor/CustomOrbitControls.js",

  "../../../src/extras/jnorthpole.js",
  "../../../src/extras/SyntaxSugar.js",
  "../../../src/extras/CyclicArray.js",
  "../../../src/extras/Playlist.js",
  "../../../src/extras/MeshNetwork.js",
  "../../../src/extras/Modifiers.js",
  "../../../src/extras/StatsManager.js",
  "../../../src/extras/HighScoreManager.js",
  "../../../src/extras/Persist.js",
  "../../../src/extras/PolyfillRenderer.js",
  "../../../src/extras/SoundManager.js",
  "../../../src/extras/PoolManager.js",
  "../../../src/extras/ArtGenerator.js",
  "../../../src/vendor/drawBezier.js",
  "../../../src/extras/ShaderLib.js",
  "../../../src/extras/AfterEffects.js",
  "../../../src/extras/Animations.js",
  "../../../src/extras/Utils.js",
  "../../../src/extras/Measure.js",
  "../../../src/extras/ShaderMaterial.js",
  "../../../src/extras/VideoRecorderManager.js",
  "../../../src/extras/scenes/SceneLoader.js",

  "../../../src/extras/controls/RTSCamera.js",
  "../../../src/extras/controls/RTSCamera2.js",
  "../../../src/extras/controls/VirtualController.js",
  "../../../src/extras/controls/PositionXZRotationYControls.js",
  "../../../src/extras/controls/RayScanner.js",

  "../../../src/objects/BaseParticle.js",
  "../../../src/objects/LightningBolt.js",
  "../../../src/objects/Terrain.js",
  "../../../src/objects/SkyBox.js",
  "../../../src/objects/Sky.js",
  "../../../src/objects/Mirror.js",
  "../../../src/objects/SpotLight.js",
  "../../../src/objects/Starfield.js",
  "../../../src/objects/Tree.js",
  "../../../src/objects/Water.js",
  "../../../src/objects/BaseText.js",
  "../../../src/objects/Button3D.js",

  "../../../src/engine/Config.js",
  "../../../src/engine/Hodler.js",

  "../../../src/engine/AssetManager.js",
  "../../../src/engine/Scene.js",
  "../../../src/engine/InputManager.js",
  "../../../src/engine/RenderManager.js",

  "../../../src/extras/scenes/AddsScene.js",
  "../../../src/extras/scenes/LoadingScene.js",
  "../../../src/extras/scenes/VideoScene.js",

  "../../../src/engine/Engine.js", // last element needs a comma
]

// These are not picked up by the build system, make sure you don't change
// ' to ". This is the difference :)
let VRUM_DEV_ONLY_DEPENDS = [
  '../../../src/vendor/brace.js',
  '../../../src/vendor/live.js', // this needs to be the last script or it won't live reload
]

const loadVrumScriptsWithDepends = (items, finishedCallback, relativeTo) => {
  if (relativeTo === undefined || relativeTo === null) { relativeTo = '' }
  if (items.length == 0) {
    if (finishedCallback instanceof Function) {
      finishedCallback()
    }
    return
  }
  const loadScript = (url, callback) => {
    var element = document.body;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    element.appendChild(script);
  }

  items.reverse()
  let url = items.pop()
  if (url.startsWith("../") && relativeTo !== '') {
    url = `${relativeTo}/${url}`
  }
  url = new URL(url, window.location.href).href
  loadScript(url, () => {
    loadVrumScriptsWithDepends(items.reverse(), finishedCallback, relativeTo)
  })
}

const loadVrumScripts = (items, finishedCallback, relativeTo) => {
  let depends = VRUM_DEPENDS.concat(items).concat(VRUM_DEV_ONLY_DEPENDS)
  loadVrumScriptsWithDepends(depends, finishedCallback, relativeTo)
}
