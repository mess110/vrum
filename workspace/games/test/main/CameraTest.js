class CameraTest extends Scene {
  init(options) {
    this.add(Utils.box())
  }

  doKeyboardEvent(event) {
    switchScene(event)
  }
}
