/*
 * Shows a slideshow on images on init, they can be skipped and switches to
 * the specified callbackScene when the images finish.
 *
 * The duration and other properties can be configured from
 * Config.instance.ui.addsScene
 *
 * Example usage:
 *
 *  let gameScene = new GameScene()
 *  let addsScene = new AddsScene(gameScene, ["vrum.png"])
 *
 *  Engine.start(addsScene, [
 *    { type: "image", path: "assets/vrum.png
 *  ])
 */
class AddsScene extends Scene {
  constructor(callbackScene, itemKeys, skippable) {
    let addsConfig = Config.instance.ui.addsScene

    if (isBlank(callbackScene)) {
      throw 'callbackScene missing'
    }
    if (!isArray(itemKeys)) {
      throw 'itemKeys needs to be an array of keys'
    }
    if (itemKeys.isEmpty()) {
      throw 'need at leasts one item key'
    }
    if (addsConfig.fadeDurationMS * 2 >= addsConfig.itemDisplayDurationSeconds * 1000) {
      throw 'fade duration * 2 can not be greater than the itemDisplayDurationSeconds. change values in Config.instance.ui.addsScene'
    }
    if (isBlank(skippable)) {
      skippable = addsConfig.skippable
    }
    super()
    this.callbackScene = callbackScene
    this.itemKeys = itemKeys
    this.skippable = skippable

    this.cameraDistanceZ = addsConfig.cameraDistanceZ
    this.itemDisplayDurationSeconds = addsConfig.itemDisplayDurationSeconds
    this.fadeDurationMS = addsConfig.fadeDurationMS
  }

  init(options) {
    let camera = this.getCamera()
    camera.position.set(0, 0, this.cameraDistanceZ)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    let queue = []
    this.itemKeys.forEach((key) => {
      let size = Utils.getTextureSize(key)
      let item = Utils.plane({ map: key, width: size.width, height: size.height })
      item.setOpacity(0)
      queue.push(item)
    })

    this.lastChange = 0
    this.queue = queue.reverse()
    this.item = undefined

    this.next()
  }

  next() {
    let nextObj = this.queue.pop()
    if (isBlank(nextObj)) {
      if (this.finished) { return }
      this.finished = true
      Engine.switch(this.callbackScene)
    } else {
      this.remove(this.item)
      this.item = nextObj
      this.add(nextObj)
      new FadeModifier(nextObj, 0, 1, this.fadeDurationMS).start()
      this.setTimeout(() => {
        new FadeModifier(nextObj, 1, 0, this.fadeDurationMS).start()
      }, this.itemDisplayDurationSeconds * 1000 - this.fadeDurationMS * 2)
    }
  }

  tick(tpf) {
    this.lastChange += tpf
    if (this.lastChange > this.itemDisplayDurationSeconds) {
      this.lastChange -= this.itemDisplayDurationSeconds
      this.next()
    }
  }

  doMouseEvent(event, raycaster) {
    if (!this.skippable) {
      return
    }
    if (event.type == 'mousedown') {
      this.next()
    }
  }

  doKeyboardEvent(event) {
    if (!this.skippable) {
      return
    }
    if (event.type == 'keydown') {
      this.next()
    }
  }
}
