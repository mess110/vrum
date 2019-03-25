/*
 * Plays a video on init, can be skipped on user input and switches the scene
 * to the specified callbackScene when the video finishes.
 *
 * Example usage:
 *
 *  let gameScene = new GameScene()
 *  let videoScene = new VideoScene(gameScene, "assets/agent.mp4")
 *
 *  Engine.switch(videoScene)
 */
class VideoScene extends Scene {
  constructor(callbackScene, videoUrl, skippable) {
    let uiConfig = Config.instance.ui
    if (isBlank(callbackScene)) {
      throw 'callbackScene missing'
    }
    if (!isString(videoUrl)) {
      throw 'videoUrl needs to be a string'
    }
    if (videoUrl === '') {
      throw 'videoUrl can not be empty'
    }
    if (!uiConfig.video.supportedFormats.includes(videoUrl.split('.').last())) {
      throw 'unsupported video format for ${videoUrl}'
    }
    if (isBlank(skippable)) {
      skippable = uiConfig.videoScene.skippable
    }
    super()
    this.callbackScene = callbackScene
    this.videoUrl = videoUrl
    this.skippable = skippable
  }

  safeRemoveVideo() {
    if (this.finished) { return }
    this.finished = true
    if (Config.instance.engine.debug) {
      console.info('videoScene.safeRemoveVideo() called')
    }
    // video could already be removed at this point, but that is ok
    // delay is automatically configured to the same time it takes
    // to fade the scene
    Utils.removeVideo()
    Engine.switch(this.callbackScene)
  }

  init(options) {
    Utils.playVideo(this.videoUrl, () => {
      Hodler.get('scene').safeRemoveVideo()
    })
  }

  doMouseEvent(event, raycaster) {
    if (!this.skippable) {
      return
    }
    if (event.type == 'mousedown') {
      this.safeRemoveVideo()
    }
  }

  doKeyboardEvent(event) {
    if (!this.skippable) {
      return
    }
    if (event.type == 'keydown') {
      this.safeRemoveVideo()
    }
  }
}
