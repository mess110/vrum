// Example usage:
//
// Config.instance.window.resize = true
// Config.instance.renderer.alpha = false
class Config {
  constructor() {
    this.engine = {
      // Enables custom logging (log msg when a model is loaded)
      // and other debug features
      debug: false,

      // Valid values are number of frames per second. Example: 60
      fixedFPS: undefined,
    }
    this.window = {
      // Automatically resize the renderer with the window
      resize: true,

      // Allow right click
      contextMenu: false,

      // what is says
      preventDefaultMouseEvents: true,

      // Show debug stats like fps, MB used, geometries, textures etc.
      showStatsOnStart: false,
    }
    this.renderer = {
      // The id added the the canvas element used for drawing. Should not
      // start with #
      domElementId: 'vrum-dom',

      // Should objects be sorted by the renderer depending on the POV?
      sortObjects: true,

      // Enable/disable antialias
      antialias: true,

      // don't worry about this one and don't touch it
      logarithmicDepthBuffer: false,

      // AKA transparent background
      alpha: true,

      // Transparent background color
      clearColor: 0x000000,

      // Amount of transparency
      clearAlpha: 1,
    }
    this.shadow = {
      details: {
        tiny: 'tiny',
        low: 'low',
        medium: 'medium',
        high: 'high',
        ultra: 'ultra'
      }
    }
    this.camera = {
      // Default camera type
      type: 'perspective',
      validCameraTypes: ['perspective', 'ortographic'],

      // Default camera field of view
      fov: 50,

      // Default camera near
      near: 0.1,

      // Default camera far
      far: 10000,
    }
    this.fade = {
      // Scene transition fade color
      color: 'black',

      // Scene transition fade duration
      duration: 1000
    }
    this.modifiers = {
      // Default modifier duration
      duration: 1000
    }
    this.networking = {
      // the name of the query param used to get the roomName for MeshNetwork
      roomQueryParamName: 'room'
    }
    this.ui = {
      // Order in which html elements are layered
      zIndex: {
        noWebGL:     1000000,
        dom:           10000,
        video:         10100,
        fade:          20000,
        orientation:   30000,
        stats:        100000,
        console:      200000
      },
      video: {
        // used internaly to hold the video container element
        containerKey: 'vrum.video.container',

        // used internally to lock one video at a time
        pendingRemovalKey: 'vrum.video.pendingRemoval',

        supportedFormats: ['mp4', 'ogg', 'ogv'],
      },
      addsScene: {
        // if the AddsScene is skippable by default
        skippable: true,

        // distance to center of the screen, where the panels are located
        cameraDistanceZ: 15,

        // how much the images are scaled, 1 img pixel to 1 three.js unit
        scaleFactor: 0.01,

        // the total time the item is displayed, including fade duration
        itemDisplayDurationSeconds: 5,

        // how long the fade in/out takes of the specific item
        fadeDurationMS: 1000,
      },
      videoScene: {
        // if the VideoScene is skippable by default
        skippable: true,
      }
    }
    // Video recorder settings
    this.recorder = {
      verbose: false,
      display: true,
      framerate: 60,
      quality: 100,
      format: 'webm',
      frameLimit: 0,
      autoSaveTime: 0
    }

    this.measure = {
      // width of the line drawns for debugging using Measure
      lineWidth: 1
    }
  }
}

Config.instance = new Config()
