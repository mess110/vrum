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
    this.lastGamepadEventTime = 0
  }

  init(options) {
    let camera = this.getCamera()
    camera.position.set(0, 0, this.cameraDistanceZ)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    let queue = []
    this.itemKeys.forEach((key) => {
      let item = this.buildItem(key)
      item.setOpacity(0)
      queue.push(item)
    })

    this.lastChange = 0
    this.queue = queue.reverse()
    this.item = undefined

    this.next()
  }

  buildItem(key) {
    let item
    if (isString(key)) {
      if (!AssetManager.has(key)) {
        throw `key ${key} for AddsScene not loaded`
      }
      item = Utils.plane({
        map: key,
        keepProportions: true,
        transparent: true,
      })
    }
    // TODO: maybe support different formats: art generator, text etc
    if (isBlank(item)) {
      throw `can't build item ${item} in AddsScene`
    }
    return item
  }

  next() {
    let nextObj = this.queue.pop()
    if (isBlank(nextObj)) {
      if (this.finished) { return }
      this.finished = true
      if (Config.instance.engine.debug) {
        console.info("addsScene finished, switching to callbackScene")
      }
      Engine.switch(this.callbackScene)
    } else {
      if (Config.instance.engine.debug) {
        console.info("addsScene showing next image")
      }
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
    if (!this.skippable) { return }
    if (event.type == 'mousedown') {
      this.next()
    }
  }

  doKeyboardEvent(event) {
    if (!this.skippable) { return }
    if (event.type == 'keydown') {
      this.next()
    }
  }

  doGamepadEvent(event) {
    if (!this.skippable) { return }
    if (event.type !== 'gamepadtick-vrum') { return }
    if (this.lastGamepadEventTime + 0.2 > this.uptime) { return }
    if (isBlank(event[0]) || isBlank(event[0].buttons)) { return }
    let buttonsPressed = event[0].buttons.filter((e) => e.pressed == true)
    if (buttonsPressed.any()) {
      this.lastGamepadEventTime = this.uptime
      this.next()
    }
  }
}
