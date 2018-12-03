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
// touch-action: none;
//
// @example
//   vj = new VirtualController()
//
//   vj.joystick2.addEventListener 'touchStart', ->
//     console.log 'fire'
//
//   vj.joystick1.deltaX()
//   vj.joystick1.up()
//
// @see https://github.com/jeromeetienne/virtualjoystick.js
// @see https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
class VirtualController {
  // create a new virtual joystick
  constructor(options){
    this.init(options);
  }

  // override this method for a different behaviour
  init(options) {
    options = this._defaultOptions(options);

    this.joystick1 = new VirtualJoystick(options.joystick1);
    this.joystick1.addEventListener('touchStartValidation', this._leftHalfTouch);

    this.joystick2 = new VirtualJoystick(options.joystick2);
    return this.joystick2.addEventListener('touchStartValidation', this._rightHalfTouch);
  }

  uninit() {
    // TODO
    throw 'TODO: not implemented yet'
  }

  // Checks if touch screen is available
  isAvailable() {
    return VirtualJoystick.touchScreenAvailable();
  }

  // @nodoc
  _leftHalfTouch(event) {
    const touch = event.changedTouches[0];
    return touch.pageX < (window.innerWidth / 2);
  }

  // @nodoc
  _rightHalfTouch(event) {
    const touch = event.changedTouches[0];
    return touch.pageX >= (window.innerWidth / 2);
  }

  // set default options
  _defaultOptions(options) {
    if (isBlank(options)) { options = {} }
    if (isBlank(options.joystick1)) { options.joystick1 = {} }
    if (isBlank(options.joystick1.strokeStyle)) { options.joystick1.strokeStyle = 'cyan' }
    if (isBlank(options.joystick1.limitStickTravel)) { options.joystick1.limitStickTravel = true }
    // if (isBlank(options.joystick1.mouseSupport)) { options.joystick1.mouseSupport = true }
    if (isBlank(options.joystick1.stickRadius)) { options.joystick1.stickRadius = 60 }

    if (isBlank(options.joystick2)) { options.joystick2 = {} }
    if (isBlank(options.joystick2.strokeStyle)) { options.joystick2.strokeStyle = 'orange' }
    if (isBlank(options.joystick2.limitStickTravel)) { options.joystick2.limitStickTravel = true }
    // if (options.joystick2.mouseSupport)) { options.joystick2.mouseSupport = true }
    if (isBlank(options.joystick2.stickRadius)) { options.joystick2.stickRadius = 0 }
    return options;
  }
}
