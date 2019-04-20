/*
 * Example usage:
 *
 *  let button = new Button3D('tutorial')
 *  button.onClick = () => {
 *    button.isEnabled = false
 *    Engine.switch(tutorialScene)
 *  }
 *  this.add(button)
 *  this.buttons.push(button)
 *
 *  button.isHovered = false
 *  button.isPressed = false
 *  button.click()
 *
 *  button.doMouseEvent(event, raycaster)
 */
class Button3D extends THREE.Object3D {
  constructor(s, bgKey, fgKey) {
    super()

    let bg = AssetManager.clone(bgKey)
    this.add(bg)
    this.bg = bg

    let fg = AssetManager.clone(fgKey)
    this.add(fg)
    this.fg = fg

    let text = this.initText(s)
    fg.add(text)
    this.text = text

    this.isHovered = false
    this.isPressed = false
    this.isEnabled = true
    this.pressSpeed = 4
    this.growSpeed = 2
    this.isMobileOrTablet = Utils.isMobileOrTablet()
  }

  initText(s) {
    let text = new BaseText({
      text: s, fillStyle: 'white',
      strokeStyle: 'black', strokeLineWidth: 1,
      canvasW: 512, canvasH: 512, align: 'center',
      font: '72px luckiest-guy'})
    text.position.set(0, -1.4, 0.7)
    return text
  }

  setFgColor(color) {
    if (!(color instanceof THREE.Color)) {
      color = new THREE.Color(color)
    }
    this.fg.children[0].material.color = color
  }

  setBgColor(color) {
    if (!(color instanceof THREE.Color)) {
      color = new THREE.Color(color)
    }
    this.bg.children[0].material.color = color
  }

  setColor(color, percent) {
    if (isBlank(percent)) { percent = 0.25 }
    this.setFgColor(color)
    // let shaded = Utils.lightenHex(color, percent)
    let shaded = Utils.darkenHex(color, percent)
    console.log(shaded)
    this.setBgColor(shaded)
  }

  setText(s) {
    this.text.setText(s)
  }

  tick(tpf) {
    let scale = this.scale.x
    if (this.isHovered) {
      let maxScale = 1.2
      scale += tpf * this.growSpeed
      if (scale > maxScale) { scale = maxScale }
    } else {
      let minScale = 1
      scale -= tpf * this.growSpeed
      if (scale < minScale) { scale = minScale }
    }
    this.scale.setScalar(scale)

    let z = this.fg.position.z
    if (this.isPressed) {
      let minZ = -0.3
      z -= tpf * this.pressSpeed
      if (z < minZ) { z = minZ }
    } else {
      let maxZ = 0
      z += tpf * this.pressSpeed
      if (z > maxZ) { z = maxZ }
    }
    this.fg.position.z = z
  }

  doMouseEvent(event, raycaster) {
    if (this.isMobileOrTablet) {
      this.doMouseMobileEvent(event, raycaster)
    } else {
      this.doMousePCEvent(event, raycaster)
    }
  }

  doMouseMobileEvent(event, raycaster) {
    if (event.type == 'mousedown' || event.type == 'mouseup') {
      let intersections = raycaster.intersectObject(this, true)
      intersections = intersections.filter((e) => !(e.object instanceof BaseText))

      if (intersections.any() && event.type == 'mousedown') {
        this.isPressed = true
      }
      if (event.type == 'mouseup') {
        if (intersections.any() && this.isPressed) {
          this.click()
        }
        this.isPressed = false
      }
    }
  }

  doMousePCEvent(event, raycaster) {
    if (event.type == 'mousemove') {
      let intersections = raycaster.intersectObject(this, true)
      intersections = intersections.filter((e) => !(e.object instanceof BaseText))
      this.isHovered = intersections.any()
    }

    if (event.type == 'mousedown') {
      if (this.isHovered) {
        this.isPressed = true
      }
    }
    if (event.type == 'mouseup') {
      this.isPressed = false
      if (this.isHovered) {
        this.click()
      }
    }
  }

  // Don't override this method, instead override onClick()
  click() {
    if (this.isEnabled) {
      this.onClick()
    }
  }

  onClick() {
    console.log('click')
  }
}
