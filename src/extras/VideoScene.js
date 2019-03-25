class VideoScene extends Scene {
  constructor(callbackScene, videoUrl) {
    super()
    this.callbackScene = callbackScene
    this.videoUrl = videoUrl
  }

  init(options) {
    Utils.playVideo(this.videoUrl)
  }

  safeRemoveVideo() {
    if (Utils.isPlayingVideo()) {
      Engine.switch(this.callbackScene)
      Utils.removeVideo()
    }
  }

  doMouseEvent(event, raycaster) {
    if (event.type == 'mousedown') {
      this.safeRemoveVideo()
    }
  }

  doKeyboardEvent(event) {
    if (event.type == 'keydown') {
      this.safeRemoveVideo()
    }
  }
}
