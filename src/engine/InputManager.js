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
      Hodler.get('scene')._doMouseEvent(event, raycaster)
    }
  }

  // @nodoc
  keyboardHandler(event) {
    Hodler.get('scene')._doKeyboardEvent(event)
  }

  // @nodoc
  wheelHandler(event) {
    Hodler.get('engine').inputManager.mouseHandler(event)
  }

  gamepadHandler(event) {
    Hodler.get('scene')._doGamepadEvent(event)
  }

  _changeEventListener(which) {
    var renderer = Hodler.get('renderer')
    renderer.domElement[which + "EventListener"]("mouseup", this.mouseHandler, false)
    renderer.domElement[which + "EventListener"]("mousedown", this.mouseHandler, false)
    renderer.domElement[which + "EventListener"]("mousemove", this.mouseHandler, false)
    renderer.domElement[which + "EventListener"]("wheel", this.wheelHandler, false)

    document[which + "EventListener"]("keydown", this.keyboardHandler, false)
    document[which + "EventListener"]("keyup", this.keyboardHandler, false)

    renderer.domElement[which + "EventListener"]("touchstart", this.touchHandler, false)
    renderer.domElement[which + "EventListener"]("touchmove", this.touchHandler, false)
    renderer.domElement[which + "EventListener"]("touchend", this.touchHandler, false)
    renderer.domElement[which + "EventListener"]("touchcancel", this.touchHandler, false)

    let gamepadSupported = Utils.gamepad()
    if (Config.instance.engine.debug) {
      console.log(`Gamepad support: ${gamepadSupported}`)
    }
    if (gamepadSupported) {
      window[which + "EventListener"]("gamepadconnected", this.gamepadHandler, false)
      window[which + "EventListener"]("gamepaddisconnected", this.gamepadHandler, false)
    }
  }

  // @nodoc
  static _parseMouseEvent(event) {
    var renderer = Hodler.get('renderer')
    if (Config.instance.window.preventDefaultMouseEvents) { event.preventDefault() }
    if (event.target !== renderer.domElement) { return }

    // could need event.clientX or event.clientY
    let size = new THREE.Vector2()
    renderer.getSize(size)
    const mouseX = ((event.layerX / size.x) * 2) - 1
    const mouseY = (-(event.layerY / size.y) * 2) + 1
    const vector = new THREE.Vector3(mouseX, mouseY, 0.5)
    var camera = Hodler.get('camera')
    vector.unproject(camera)
    return new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
  }
}
