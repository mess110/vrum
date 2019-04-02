/*
 * Allows controlling a mesh with keyboard/gamepad/mobile
 *
 * Moves the mesh in X and Z
 * Mesh always faces the direction of motion (Y axis)
 * Friction can be applied
 *
 * Example usage:
 *
 *  let control = new PositionXZRotationYControls()
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
 *  this.control.doGamepadEvent(event)
*/
class PositionXZRotationYControls {
  constructor() {
    this.keys = {}
    this.keybindings = {
      'Forward': 'KeyW',
      'Backward': 'KeyS',
      'Left': 'KeyA',
      'Right': 'KeyD',
    }

    let vj = new VirtualController()
    this.vj = vj

    this.isMobileOrTablet = Utils.isMobileOrTablet()
    this.velocity = new THREE.Vector3(0, 0, 0)
    this.speed = 5
    this.acceleration = 1
    this.friction = 0.9
    this.targetRotationY = 0
    this.rotationY = 0
    this.rotationSpeed = 12
  }

  is(which) {
    return this.keys[this.keybindings[which]]
  }

  isMoving() {
    return this.is('Forward') || this.is('Backward') || this.is('Left') || this.is('Right')
  }

  // Quaternion based rotation
  //
  // var quaternion = new THREE.Quaternion()
  // quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), this.targetRotationY)
  // this.tank.quaternion.slerp(quaternion, (rSpeed * tpf))
  tickRotation(tpf) {
    let diff = Math.abs(this.rotationY - this.targetRotationY)
    if (diff >= this.rotationSpeed * tpf) {
      let tankR = Measure.radiansToDeg(this.rotationY)
      let targetR = Measure.radiansToDeg(this.targetRotationY)
      if (Measure.calcShortestRotDirection(tankR, targetR)) {
        this.rotationY += this.rotationSpeed * tpf
      } else {
        this.rotationY -= this.rotationSpeed * tpf
      }
      this.rotationY = Measure.normalizeRadians(this.rotationY)
    } else {
      this.rotationY = this.targetRotationY
    }
  }

  tick(tpf) {
    if (this.is('Forward')) {
      if (this.velocity.z > -this.speed) {
        this.velocity.z -= tpf * this.acceleration
      }
      this.targetRotationY = Math.PI
    }

    if (this.is('Backward')) {
      if (this.velocity.z < this.speed) {
        this.velocity.z += tpf * this.acceleration
      }
      this.targetRotationY = 0
    }

    if (this.is('Left')) {
      if (this.velocity.x > -this.speed) {
        this.velocity.x -= tpf * this.acceleration
      }
      this.targetRotationY = Math.PI / 2 * 3
    }

    if (this.is('Right')) {
      if (this.velocity.x < this.speed) {
        this.velocity.x += tpf * this.acceleration
      }
      this.targetRotationY = Math.PI / 2
    }

    if (this.is('Forward') && this.is('Left')) {
      this.targetRotationY = (Math.PI + Math.PI / 2 * 3) / 2
    }
    if (this.is('Forward') && this.is('Right')) {
      this.targetRotationY = (Math.PI + Math.PI / 2) / 2
    }
    if (this.is('Backward') && this.is('Left')) {
      this.targetRotationY = (Math.PI * 2 + Math.PI / 2 * 3) / 2
    }
    if (this.is('Backward') && this.is('Right')) {
      this.targetRotationY = (0 + Math.PI / 2) / 2
    }

    this.velocity.x *= this.friction
    this.velocity.z *= this.friction

    this.tickRotation(tpf)
  }

  doKeyboardEvent(event) {
    if (!Object.values(this.keybindings).includes(event.code)) { return }
    this.keys[event.code] = event.type == "keydown"
  }

  doGamepadEvent(event) {
    if (event.type !== 'gamepadtick-vrum') { return }
    let gamepad = event[0]
    if (isBlank(gamepad)) { return }

    if (gamepad.axes[0] > 0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'KeyD'})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: 'KeyD'})
    }
    if (gamepad.axes[0] < -0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'KeyA'})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: 'KeyA'})
    }
    if (gamepad.axes[1] > 0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'KeyS'})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: 'KeyS'})
    }
    if (gamepad.axes[1] < -0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'KeyW'})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: 'KeyW'})
    }
  }

  doMobileEvent() {
    if (!this.isMobileOrTablet) {
      return
    }

    let joy = this.vj.joystick1
    if (joy.right()) {
      this.doKeyboardEvent({type: 'keydown', code: 'KeyD'})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: 'KeyD'})
    }
    if (joy.left()) {
      this.doKeyboardEvent({type: 'keydown', code: 'KeyA'})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: 'KeyA'})
    }
    if (joy.down()) {
      this.doKeyboardEvent({type: 'keydown', code: 'KeyS'})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: 'KeyS'})
    }
    if (joy.up()) {
      this.doKeyboardEvent({type: 'keydown', code: 'KeyW'})
    } else {
      this.doKeyboardEvent({type: 'keyup', code: 'KeyW'})
    }
  }
}
