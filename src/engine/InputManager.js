class InputManager {
  constructor() {
    this.enabled = undefined
    this.enable()
  }

  enable() {
    this.enabled = true
    this.keyboard = new THREEx.KeyboardState()
    this._changeEventListener('add')
  }

  disable() {
    this.enabled = false
    this.keyboard.destroy()
    this._changeEventListener('remove')
  }

  // Delegate touches to mouse events
  touchHandler(event) {
    const touches = event.changedTouches
    const first = touches[0]
    let type = ''
    switch (event.type) {
      case 'touchstart':
        type = 'mousedown'
        break
      case 'touchmove':
        type = 'mousemove'
        break
      case 'touchend':
        type = 'mouseup'
        break
      default:
        return
    }
    // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //                screenX, screenY, clientX, clientY, ctrlKey, 
    //                altKey, shiftKey, metaKey, button, relatedTarget)
    const simulatedEvent = document.createEvent('MouseEvent')
    simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null)
    first.target.dispatchEvent(simulatedEvent)
    event.preventDefault()
  }

  // @nodoc
  mouseHandler(event) {
    const raycaster = InputManager._parseMouseEvent(event)
    if (raycaster != null) {
      var scene = Hodler.get('scene')
      scene.doMouseEvent(event, raycaster)
    }
  }

  // @nodoc
  keyboardHandler(event) {
    Hodler.get('scene').doKeyboardEvent(event)
  }

  _changeEventListener(which) {
    var renderer = Hodler.get('renderer')
    renderer.domElement[which + "EventListener"]("mouseup", this.mouseHandler, false)
    renderer.domElement[which + "EventListener"]("mousedown", this.mouseHandler, false)
    renderer.domElement[which + "EventListener"]("mousemove", this.mouseHandler, false)

    document[which + "EventListener"]("keydown", this.keyboardHandler, false)
    document[which + "EventListener"]("keyup", this.keyboardHandler, false)

    renderer.domElement[which + "EventListener"]("touchstart", this.touchHandler, false)
    renderer.domElement[which + "EventListener"]("touchmove", this.touchHandler, false)
    renderer.domElement[which + "EventListener"]("touchend", this.touchHandler, false)
    renderer.domElement[which + "EventListener"]("touchcancel", this.touchHandler, false)
  }

  // @nodoc
  static _parseMouseEvent(event) {
    var renderer = Hodler.get('renderer')
    if (Config.instance.window.preventDefaultMouseEvents) { event.preventDefault() }
    if (event.target !== renderer.domElement) { return }

    // could need event.clientX or event.clientY
    const size = renderer.getSize()
    const mouseX = ((event.layerX / size.width) * 2) - 1
    const mouseY = (-(event.layerY / size.height) * 2) + 1
    const vector = new THREE.Vector3(mouseX, mouseY, 0.5)
    var camera = Hodler.get('camera')
    vector.unproject(camera)
    return new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
  }
}
