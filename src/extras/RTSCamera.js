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
    oc.keyPanSpeed = 5
    oc.enableRotate = false

    // TODO: might need to be scaled to height
    oc.zoomSensitivity = 150 // number of pixels needed to be considered zoom

    this.enabled = true
    this.oc = oc

    this.percentOfWidthPan = 10
    this.percentOfHeightPan = 10

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

    if (Config.instance.window.resize) {
      this.size = this.getSize()
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

    if (this.lastY < (this.size.height * this.percentOfHeightPan) / 100) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.UP,
        'preventDefault': () => {
        }
      })
    }
    if (this.lastY > (this.size.height - (this.size.height * this.percentOfHeightPan) / 100)) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.BOTTOM,
        'preventDefault': () => {
        }
      })
    }
    if (this.lastX < (this.size.width * this.percentOfWidthPan) / 100) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.LEFT,
        'preventDefault': () => {
        }
      })
    }
    if (this.lastX > (this.size.width - (this.size.width * this.percentOfWidthPan) / 100)) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.RIGHT,
        'preventDefault': () => {
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
