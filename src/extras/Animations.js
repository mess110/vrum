class Animations {
  constructor(mixer, animations) {
    this.animations = animations
    this.mixer = mixer
    this.stopAllExceptions = []
  }

  names() {
    return this.animations.map((e) => { return e._clip.name })
  }

  get(target) {
    if (isNumeric(target)) {
      let index = parseInt(target)
      if (index >= this.animations.size()) {
        throw `Animation index ${index} out of bounds`
      }
      return this.animations[index]
    } else {
      let animation = this.animations.filter((e) => { return e._clip.name == target }).first()
      if (animation === undefined) {
        throw `Animation name ${target} not found`
      }
      return animation
    }
  }

  isRunning(target) {
    return this.get(target).isRunning()
  }

  play(name, options) {
    if (isBlank(options)) { options = {} }

    if (isBlank(options.name)) { options.name = name }
    if (isBlank(options.loop)) { options.loop = true }
    if (isBlank(options.reverse)) { options.reverse = false }
    if (isBlank(options.timeScale)) { options.timeScale = 1 }
    if (isBlank(options.weight)) { options.weight = 1 }
    if (isBlank(options.stopAll)) { options.stopAll = true }
    if (isBlank(options.stopAllExceptions)) { options.stopAllExceptions = this.stopAllExceptions }

    if (options.reverse) { options.timeScale *= -1 }

    let animation = this.get(options.name)
    animation.setEffectiveTimeScale(options.timeScale)
    animation.setEffectiveWeight(options.weight)

    if (options.loop) {
      animation.clampWhenFinished = false
      animation.setLoop(THREE.LoopRepeat)
    } else {
      animation.clampWhenFinished = true
      animation.setLoop(THREE.LoopOnce, 0)
    }

    if (options.reverse) {
      animation.clampWhenFinished = true
      animation.setLoop(THREE.LoopRepeat)
    }

    if (!isBlank(animation.playTimeout)) {
      clearTimeout(animation.playTimeout)
      animation.playTimeout = undefined
    }

    let duration = (animation._clip.duration / Math.abs(animation._effectiveTimeScale)) * 1000
    if (options.stopAll) { this.stopAll(options.stopAllExceptions) }
    animation.play()

    if (options.reverse && options.loop == false) {
      animation.playTimeout = setTimeout(() => {
        animation.stop()
      }, duration)
    }

    return animation
  }

  stopAll(exceptions) {
    this.animations.forEach((animation) => {
      if (!(exceptions.includes(animation._clip.name) ||
          exceptions.includes(this.animations.indexOf(animation)))) {
        animation.stop()
      }
    })
  }

  tick(tpf) {
    this.mixer.update(tpf)
  }

  static init(model, gltf) {
    let mixer, src_animations
    let animations = []
    if (gltf !== undefined) {
      mixer = new THREE.AnimationMixer(model)
      src_animations = gltf.animations
    } else {
      mixer = new THREE.AnimationMixer(model)
      if (model.geometry !== undefined) {
        src_animations = model.geometry.animations
      } else {
        src_animations = []
      }
    }
    src_animations.forEach(function(animation) {
      var anim = mixer.clipAction(animation)
      animations.push(anim)
    })

    model.animations = new Animations(mixer, animations)
  }
}
