// Example usage:
//
//   this.rtsCam = new RTSCamera()
//   this.rtsCam.tick(tpf)
//   this.rtsCam.doMouseEvent(event)
//
class RTSCamera {
  constructor() {
    let oc = Utils.toggleOrbitControls()
    oc.enableDamping = true
    oc.minPolarAngle = 0.2;
    oc.maxPolarAngle = 1.4;
    oc.dampingFactor = 0.07;
    oc.rotateSpeed = 0.05;
    oc.panSpeed = 0.5
    oc.keyPanSpeed = 20
    oc.enableRotate = false
    this.oc = oc
    this.uptime = 0.0
    this.lastTime = 0.0

    this.size = Hodler.get('renderer').getSize()
    this.lastX = this.size.width / 2
    this.lastY = this.size.height / 2
  }

  tick(tpf) {
    this.uptime += tpf
    this.oc.update()

    if (this.lastTime > this.uptime) {
      return
    }

    if (Utils.isMobileOrTablet()) {
      return
    }
    let delay = 0.05
    if (this.lastY < this.size.height / 6) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.UP,
        'preventDefault': () => {
          this.lastTime = this.uptime + delay
        }
      })
    }
    if (this.lastY > (this.size.height / 6) * 5) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.BOTTOM,
        'preventDefault': () => {
          this.lastTime = this.uptime + delay
        }
      })
    }
    if (this.lastX < this.size.width / 6) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.LEFT,
        'preventDefault': () => {
          this.lastTime = this.uptime + delay
        }
      })
    }
    if (this.lastX > (this.size.width / 6) * 5) {
      this.oc.handleKeyDown({
        'keyCode': this.oc.keys.RIGHT,
        'preventDefault': () => {
          this.lastTime = this.uptime + delay
        }
      })
    }
  }

  doMouseEvent(event) {
    if (event.type == 'mousemove') {
      this.lastY = event.y
      this.lastX = event.x
    }
  }

  getState() {
    return this.oc.getState()
  }

  isStatic() {
    return this.getState() === -1
  }
}
