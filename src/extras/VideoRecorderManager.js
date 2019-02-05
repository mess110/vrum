/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// @nodoc
var VideoRecorderManager = (function() {
  let instance = undefined;
  VideoRecorderManager = class VideoRecorderManager {
    static initClass() {

      instance = null;

      Singleton.VideoRecorderManager = class VideoRecorderManager {

        constructor() {
          this.recording = false;
        }

        capture(domElement) {
          if (this.recording === false) { return; }
          this.recorder.capture(domElement);
        }

        start() {
          if (this.recorder == null) {
            this.recorder = new CCapture(Config.instance.recorder);
          }
          this.recorder.start();
          this.recording = true;
        }

        stop() {
          this.recorder.stop();
          this.recording = false;
          this.recorder.save()
        }

        isRecording() {
          return this.recording
        }
      };
    }

    static get() {
      return instance != null ? instance : (instance = new Singleton.VideoRecorderManager());
    }

    static start() {
      this.get().start();
    }

    static stop() {
      this.get().stop();
    }

    static isRecording() {
      return this.get().isRecording()
    }

    static capture(domElement) {
      this.get().capture(domElement);
    }
  };
  VideoRecorderManager.initClass();
  return VideoRecorderManager;
})();
