// https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md
//
// http://tweenjs.github.io/tween.js/examples/03_graphs.html
//
// Example usage:
//
//   var up = new BaseModifier(cube.position, { x: '+1' }, 1000, TWEEN.Easing.Linear.None)
//   var down = new BaseModifier(cube.position, { x: '-1' })
//   up.chain(down)
//   down.chain(up)
//   up.start()
//
class BaseModifier extends TWEEN.Tween {
  constructor(subject, target, duration, easing) {
    super(subject)

    if (duration == null) { duration = 1000 }
    if (easing == null) { easing = TWEEN.Easing.Linear.None }
    this.easing(easing);

    this.to(target, duration)
        .onStart(function () {
        })
        .onUpdate(function() {
        })
        .onComplete(function (obj) {
        })
        .onStop(function(obj) {
        })
  }

  // only works when repeat is used
  yoyo() {
    return super.yoyo()
  }

  // amount can be Infinity or an int
  repeat(amount) {
    return super.repeat(amount)
  }

  easing(easing) {
    return super.easing(easing)
  }

  delay(amount) {
    return super.delay(amount)
  }

  chain(tweens) {
    return super.chain(tweens)
  }
}

// NOTE: chaining does not work with fade modifier
class FadeModifier extends BaseModifier {
  constructor(subject, fromAlpha, toAlpha, duration) {
    super({ x: fromAlpha}, { x: toAlpha }, duration, TWEEN.Easing.Linear.None)
    this.onUpdate(function (obj) {
      subject.setOpacity(obj.x)
    })
  }
}

class WeightModifier extends BaseModifier {
  constructor(subject, fromWeight, toWeight, duration) {
    super({ x: fromWeight }, { x: toWeight }, duration, TWEEN.Easing.Exponential.Out)
    this.onUpdate(function (obj) {
      subject.setEffectiveWeight(obj.x)
    })
  }
}

class ScaleModifier extends BaseModifier {
  constructor(subject, fromScale, toScale, duration) {
    subject.x = fromScale
    subject.y = fromScale
    subject.z = fromScale
    super(subject, { x: toScale, y: toScale, z: toScale}, duration, TWEEN.Easing.Exponential.Out)
  }
}
