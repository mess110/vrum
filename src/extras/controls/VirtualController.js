/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// A wrapper for the virtual joystick.
//
// By default, it has an analog joystick on the left half and a button on the right
// half
//
// Makes sure the browser doesn't send a warning for passive events:
//
//  touch-action: none;
//
// This is added/removed automatically.
//
// @example
//   vj = new VirtualController()
//
//   vj.joystickRight.addEventListener 'touchStart', ->
//     console.log 'fire'
//
//   vj.joystickLeft.deltaX()
//   vj.joystickLeft.up()
//
// @see https://github.com/jeromeetienne/virtualjoystick.js
// @see https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
class VirtualController {
  // create a new virtual joystick
  constructor(options){
    this.init(options)
  }

  log(s) {
    if (Config.instance.engine.debug) {
      console.log(s)
    }
  }

  // override this method for a different behaviour
  init(options) {
    // if (!VirtualController.isAvailable()) { return }
    options = this._defaultOptions(options)

    this.joystickLeft = new VirtualJoystick(options.joystickLeft)
    this.joystickLeft.addEventListener('touchStartValidation', this._leftHalfTouch)

    this.joystickRight = new VirtualJoystick(options.joystickRight)
    this.joystickRight.addEventListener('touchStartValidation', this._rightHalfTouch)

    let mainDomElement = this.getMainDomElement()
    this.oldTouchActionValue = mainDomElement.style['touch-action']
    mainDomElement.style['touch-action'] = 'none'
  }

  uninit() {
    // if (!VirtualController.isAvailable()) { return }
    [this.joystickLeft, this.joystickRight].forEach((joystick) => {
      try {
        joystick.destroy()
      } catch (e) {
        if (e instanceof DOMException) {
          this.log('VirtualController: joystick already removed')
        } else {
          throw e
        }
      }
    })
    this.getMainDomElement().style['touch-action'] = this.oldTouchActionValue
  }

  trackIsPressed() {
    ['joystickLeft', 'joystickRight'].forEach((joystick) => {
      this[joystick].isPressed = false
      this[joystick].addEventListener('touchStart', () => {
        this[joystick].isPressed = true
      })

      this[joystick].addEventListener('touchEnd', () => {
        this[joystick].isPressed = false
      })
    })
  }

  getMainDomElement() {
    return document.querySelector(`#${Config.instance.renderer.domElementId}`)
  }

  // Checks if touch screen is available
  static isAvailable() {
    return VirtualJoystick.touchScreenAvailable() || Utils.isMobileOrTablet()
  }

  // @nodoc
  _leftHalfTouch(event) {
    const touch = event.changedTouches[0]
    return touch.pageX < (window.innerWidth / 2)
  }

  // @nodoc
  _rightHalfTouch(event) {
    const touch = event.changedTouches[0]
    return touch.pageX >= (window.innerWidth / 2)
  }

  // set default options
  _defaultOptions(options) {
    if (isBlank(options)) { options = {} }
    if (isBlank(options.joystickLeft)) { options.joystickLeft = {} }
    if (isBlank(options.joystickLeft.strokeStyle)) { options.joystickLeft.strokeStyle = 'cyan' }
    if (isBlank(options.joystickLeft.limitStickTravel)) { options.joystickLeft.limitStickTravel = true }
    if (isBlank(options.joystickLeft.stickRadius)) { options.joystickLeft.stickRadius = 60 }
    if (isBlank(options.joystickLeft.mouseSupport)) { options.joystickLeft.mouseSupport = false }

    if (isBlank(options.joystickRight)) { options.joystickRight = {} }
    if (isBlank(options.joystickRight.strokeStyle)) { options.joystickRight.strokeStyle = 'orange' }
    if (isBlank(options.joystickRight.limitStickTravel)) { options.joystickRight.limitStickTravel = true }
    if (isBlank(options.joystickRight.stickRadius)) { options.joystickRight.stickRadius = 0 }
    if (isBlank(options.joystickRight.mouseSupport)) { options.joystickRight.mouseSupport = false }
    return options
  }
}
