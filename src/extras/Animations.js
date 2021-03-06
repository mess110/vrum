class Animations {
  constructor(mixer, animations) {
    this.animations = animations
    this.mixer = mixer
    this.stopAllExceptions = []

    this.from = undefined
    this.wfo = undefined
    this.hfi = undefined
    this.hfo = undefined
    this.wfi = undefined
    this.time1 = undefined
    this.time2 = undefined
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

  playRandom(options) {
    this.play(this.names().shuffle().first(), options)
  }

  play(name, options) {
    options = this._parseOptions(name, options)
    let animation = this.get(options.name)

    // if it has an outline, play the outline animation as well
    let outline = animation._mixer._root.outline
    if (!isBlank(outline)) {
      outline.animations.play(name, options)
    }

    animation.setEffectiveTimeScale(options.timeScale)
    animation.setEffectiveWeight(options.weight)

    if (options.loop) {
      animation.clampWhenFinished = false
      animation.setLoop(THREE.LoopRepeat)
    } else {
      animation.clampWhenFinished = true
      animation.setLoop(THREE.LoopOnceClamp, 1)
    }

    let duration = this.getDuration(options.name)
    if (options.stopAll) { this.stopAll(options.stopAllExceptions) }

    animation.play()
    return animation
  }

  stop(name, options) {
    options = this._parseOptions(name, options)
    let animation = this.get(options.name)

    // if it has an outline, stop the outline animation as well
    let outline = animation._mixer._root.outline
    if (!isBlank(outline)) {
      outline.animations.stop(name, options)
    }

    animation.stop()
    return animation
  }

  // Fading between animations instead of an instant switch. The fade happens
  // by adjusting the weights so the targeted animations needs to be playing.
  // An animation could have weight 0 which means it has no visual influence on
  // the model.
  //
  // The animation starts from a certain position. Think of that position as the
  // `from` animation, or the animation from which the new animation transitions
  // from.
  //
  // Example:
  //
  //    // set the from animation to idle
  //    model.animations.from = 'idle'
  //
  //    // play idle and walk
  //    model.animations.play('idle', { stopAll: false })
  //    model.animations.play('walk', { stopAll: false, weight: 0 })
  //
  //    // play unrelated animations
  //    model.animations.play('wiggle', { stopAll: false })
  //    model.animations.play('tongue', { stopAll: false })
  //
  //   Hodler.get('scene').model.animations.fadeAnimation('hit', 'idle')
  fadeAnimation(to, after) {
    if (isBlank(after)) { after = this.from }

    if (!isBlank(this.time1)) { clearTimeout(this.time1); this.time1 = undefined }
    if (!isBlank(this.time2)) { clearTimeout(this.time2); this.time2 = undefined }
    if (!isBlank(this.wfo))   { TWEEN.remove(this.wfo); this.wfo = undefined }
    if (!isBlank(this.hfi))   { TWEEN.remove(this.hfi); this.hfi = undefined }
    if (!isBlank(this.hfo))   { TWEEN.remove(this.hfo); this.hfo = undefined }
    if (!isBlank(this.wfi))   { TWEEN.remove(this.wfi); this.wfi = undefined }

    let scene = Hodler.get('mainScene')
    let fromAnimation = scene.model.animations.get(this.from)
    let toAnimation = scene.model.animations.get(to)
    let afterAnimation = scene.model.animations.get(after)

    if (toAnimation.isRunning() && !['walk', 'idle'].includes(to)) {
      toAnimation.stop()
    }

    this.from = after

    // TODO: for some reason, the timeScale of the animation gets reset to 0
    fromAnimation.setEffectiveTimeScale(1)
    toAnimation.setEffectiveTimeScale(1)
    afterAnimation.setEffectiveTimeScale(1)

    let toDuration = scene.model.animations.getDuration(to)
    let transitionDuration = toDuration / 3

    if (!['walk', 'idle'].includes(to)) {
      scene.model.animations.play(to, { weight: 0, loop: false, stopAll: false })
    }

    this.wfo = new WeightModifier(fromAnimation, 1, 0, transitionDuration).start()
    this.hfi = new WeightModifier(toAnimation, 0, 1, transitionDuration).start()

    let that = this
    this.time1 = setTimeout(() => {
      if (to !== after) {
        that.hfo = new WeightModifier(toAnimation, 1, 0, transitionDuration).start()
        that.wfi = new WeightModifier(afterAnimation, 0, 1, transitionDuration).start()
      }
      that.time2 = setTimeout(() => {
        if (!['walk', 'idle'].includes(to)) {
          toAnimation.stop()
        }
      }, transitionDuration)
    }, toDuration - transitionDuration)
  }

  _parseOptions(name, options) {
    if (isBlank(options)) { options = {} }
    if (isBlank(options.name)) { options.name = name }
    if (isBlank(options.loop)) { options.loop = true }
    if (isBlank(options.reverse)) { options.reverse = false }
    if (isBlank(options.timeScale)) { options.timeScale = 1 }
    if (isBlank(options.weight)) { options.weight = 1 }
    if (isBlank(options.stopAll)) { options.stopAll = true }
    if (isBlank(options.stopAllExceptions)) { options.stopAllExceptions = this.stopAllExceptions.shallowClone() }
    if (options.reverse) { options.timeScale *= -1 }
    // options.stopAllExceptions.push(options.name)
    // if (options.loop) { options.stopAllExceptions.push(options.name) }
    return options
  }

  getDuration(target) {
    let animation = this.get(target)
    let clipDuration = animation._clip.duration
    let timeScale = Math.abs(animation._effectiveTimeScale)
    return (clipDuration * 1000) / timeScale
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
    let src_animations
    let animations = []
    let mixer = new THREE.AnimationMixer(model)
    if (gltf !== undefined) {
      src_animations = gltf.animations
    } else {
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
