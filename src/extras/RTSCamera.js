// Remember to check oc.zoomSensitivity
//
// Example usage:
//
//   this.rtsCam = new RTSCamera()
//   this.rtsCam.tick(tpf)
//   this.rtsCam.doMouseEvent(event)
//   this.rtsCam.toggle()
//
class RTSCamera {
  constructor() {
    this.touch = Utils.isMobileOrTablet()

    let oc = Utils.toggleOrbitControls(THREE.CustomOrbitControls)
    oc.enableDamping = true
    oc.minDistance = 3
    oc.maxDistance = 50
    oc.minPolarAngle = 0.2;
    oc.maxPolarAngle = 1.4;
    oc.dampingFactor = 0.07;
    oc.zoomDampingFactor = 0.1;
    oc.rotateSpeed = 0.05;
    oc.panSpeed = 0.5
    oc.keyPanSpeed = 10
    oc.enableRotate = false
    oc.zoomSensitivity = 150 // number of pixels needed to be considered zoom

    this.enabled = true
    this.oc = oc
    this.uptime = 0.0
    this.lastTime = 0.0

    this.size = this.getSize()
    this.lastX = this.size.width / 2
    this.lastY = this.size.height / 2

    this.delaySeconds = 0.05
  }

  toggle() {
    this.enabled = !this.enabled
    this.oc.enabled = this.enabled
    return this.enabled
  }

  tick(tpf) {
    if (!this.enabled) { return }

    this.uptime += tpf

    if (Config.instance.window.resize) {
      this.size = this.getSize()
    }

    if (this.lastTime > this.uptime) {
      return
    }

    if (!this.touch) {
      this.edgePan()
    }
    this.oc.update()
  }

  doMouseEvent(event) {
    if (!this.enabled) { return }

    if (event.type == 'mousemove') {
      this.lastY = event.y
      this.lastX = event.x
    }
  }

  edgePan() {
    if (this.isRotating()) {
      return
    }

    if (this.lastY < this.size.height / 6) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.UP,
        'preventDefault': () => {
          this.lastTime = this.uptime + this.delaySeconds
        }
      })
    }
    if (this.lastY > (this.size.height / 6) * 5) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.BOTTOM,
        'preventDefault': () => {
          this.lastTime = this.uptime + this.delaySeconds
        }
      })
    }
    if (this.lastX < this.size.width / 6) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.LEFT,
        'preventDefault': () => {
          this.lastTime = this.uptime + this.delaySeconds
        }
      })
    }
    if (this.lastX > (this.size.width / 6) * 5) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.RIGHT,
        'preventDefault': () => {
          this.lastTime = this.uptime + this.delaySeconds
        }
      })
    }
  }

  getSize() {
    return Hodler.get('renderer').getSize()
  }

  getState() {
    return this.oc.getState()
  }

  isStatic() {
    return this.getState() === this.oc.STATE.NONE
  }

  isRotating() {
    return this.getState() === this.oc.STATE.ROTATE
  }
}
