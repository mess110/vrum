// Example usage:
//
// vrum.Config.window.resize = true
// vrum.Config.renderer.alpha = false
class Config {
  constructor() {
    this.engine = {
      debug: false
    }
    this.window = {
      resize: true,
      contextMenu: false,
      preventDefaultMouseEvents: true,
      showStatsOnStart: false,
    }
    this.renderer = {
      sortObjects: true,
      antialias: true,
      alpha: true, // AKA transparent background
      logarithmicDepthBuffer: false,

      clearColor: 0x000000,
      clearAlpha: 1,
    }
    this.camera = {
      type: 'THREE.PerspectiveCamera',
      fov: 50,
      near: 0.1,
      far: 10000,
    }
    this.fade = {
      color: 'black',
      duration: 1000
    }
    this.ui = {
      zIndex: 100000
    }
    this.recorder = {
      verbose: false,
      display: true,
      framerate: 60,
      quality: 100,
      format: 'webm',
      frameLimit: 0,
      autoSaveTime: 0
    }
  }
}

Config.instance = new Config()
