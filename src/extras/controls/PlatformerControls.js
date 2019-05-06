/*
 * Allows platformer controls with keyboard/gamepad/mobile
 *
 * Moves the mesh in X and Z
 * Mesh always faces the direction of motion (Y axis)
 * Friction can be applied
 *
 * Example usage:
 *
 *  let control = new PlatformerControls()
 *  this.control = control
 *
 *  // within the scene tick method
 *  this.control.doMobileEvent() // only if you want mobile support
 *  this.control.tick(tpf)
 *
 *  this.tank.position.x += this.control.velocity.x
 *  this.tank.position.z += this.control.velocity.z
 *
 *  if (this.control.isMoving()) {
 *    // spin wheels
 *  }
 *
 *  // within each of their respective methods
 *  this.control.doKeyboardEvent(event)
 *  this.control.doGamepadEvent(event, gamepadIndex)
 *  this.control.doMobileEvent(joystick) // from VirtualController
*/
class PlatformerControls {
  constructor() {
    this.keys = {}
    this.keybindings = {
      'Up': 'KeyW',
      'Down': 'KeyS',
      'Left': 'KeyA',
      'Right': 'KeyD',
    }
    this.gamepadbindings = {
      'StickLeftRight': 0,
      'StickUpDown': 1,
    }

    this.jumping = true
    this.velocity = new THREE.Vector3(0, 0)
    this.friction = 0.9
    this.frictionMoving = 0.7
    this.jumpFriction = 0.99
    this.speed = 1.25
    this.jumpSpeed = 30
    this.canJump = true
    this.gravity = 1.5
    this.jumpSaveMs = 200
    this.jumpAt = 0
  }

  is(which) {
    return this.keys[this.keybindings[which]]
  }

  isMoving() {
    return this.is('Up') || this.is('Down') || this.is('Left') || this.is('Right')
  }

  tick(tpf) {
    let up = this.is('Up')
    let down = this.is('Down')
    let left = this.is('Left')
    let right = this.is('Right')

    let now = new Date().getTime()

    if (up && !this.jumping && this.canJump) {
      this.velocity.y = this.jumpSpeed
      this.jumping = true
      this.canJump = false
    }

    if (left) {
      this.velocity.x -= this.speed
    }

    if (right) {
      this.velocity.x += this.speed
    }

    this.velocity.y -= this.gravity

    if (left || right) {
      this.velocity.x *= this.friction
    } else {
      this.velocity.x *= this.frictionMoving
    }

    if (this.velocity.y < -30) {
      this.velocity.y = -30
    }
    if (this.velocity.y > 30) {
      this.velocity.y = 30
    }
    this.velocity.y *= this.jumpFriction
  }

  land() {
    this.jumping = false
    this.velocity.y = 0
  }

  doKeyboardEvent(event) {
    if (!Object.values(this.keybindings).includes(event.code)) { return }
    this.keys[event.code] = event.type == "keydown"
    if (event.type == 'keyup' && event.code == this.keybindings['Up']) {
      this.canJump = true
    }
  }

  doGamepadEvent(event, gamepadIndex) {
    if (event.type !== 'gamepadtick-vrum') { return }
    if (isBlank(gamepadIndex)) { gamepadIndex = 0 }
    let gamepad = event[gamepadIndex]
    if (isBlank(gamepad)) { return }

    if (this.getGamepadDeltaX(gamepad) > 0.5) {
      this.doKeyboardEvent({type: 'keydown', code: this.keybindings['Right']})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: this.keybindings['Right']})
    }
    if (this.getGamepadDeltaX(gamepad) < -0.5) {
      this.doKeyboardEvent({type: 'keydown', code: this.keybindings['Left']})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: this.keybindings['Left']})
    }
    if (this.getGamepadDeltaY(gamepad) > 0.5) {
      this.doKeyboardEvent({type: 'keydown', code: this.keybindings['Down']})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: this.keybindings['Down']})
    }
    if (this.getGamepadDeltaY(gamepad) < -0.5) {
      this.doKeyboardEvent({type: 'keydown', code: this.keybindings['Up']})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: this.keybindings['Up']})
    }
  }

  getGamepadDeltaX(gamepad) {
    return gamepad.axes[this.gamepadbindings['StickLeftRight']]
  }

  getGamepadDeltaY(gamepad) {
    return gamepad.axes[this.gamepadbindings['StickUpDown']]
  }

  doMobileEvent(joy) {
    if (joy.right()) {
      this.doKeyboardEvent({type: 'keydown', code: this.keybindings['Right']})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: this.keybindings['Right']})
    }
    if (joy.left()) {
      this.doKeyboardEvent({type: 'keydown', code: this.keybindings['Left']})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: this.keybindings['Left']})
    }
    if (joy.down()) {
      this.doKeyboardEvent({type: 'keydown', code: this.keybindings['Down']})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: this.keybindings['Down']})
    }
    if (joy.up()) {
      this.doKeyboardEvent({type: 'keydown', code: this.keybindings['Up']})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: this.keybindings['Up']})
    }
  }

  // use this to construct a joy object which can be sent to doMobileEvent
  // the joystick param is input from `controller` app.
  vrumControl2Jostick(joystick) {
    let obj = {
      left: () => {
        if (isBlank(joystick.direction)) { return false }
        return joystick.direction.contains('left')
      },
      right: () => {
        if (isBlank(joystick.direction)) { return false }
        return joystick.direction.contains('right')
      },
      down: () => {
        if (isBlank(joystick.direction)) { return false }
        return joystick.direction.contains('down')
      },
      up: () => {
        if (isBlank(joystick.direction)) { return false }
        return joystick.direction.contains('up')
      }
    }
    return obj
  }
}
