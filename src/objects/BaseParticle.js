class BaseParticle extends THREE.Object3D {
  constructor(input) {
    super()

    input = arrayOrStringToString(input)

    let jsonInput;
    this.groups = [];
    this.emitters = [];

    eval(`jsonInput = ${input}`);
    if (jsonInput == null) { jsonInput = []; }
    this.jsonInput = jsonInput

    for (let json of Array.from(jsonInput)) {
      const group = new (SPE.Group)(json);
      for (let emitJson of Array.from(json.emitters)) {
        const emitter = new (SPE.Emitter)(emitJson);
        group.addEmitter(emitter);
        this.emitters.push(emitter)
      }
      this.groups.push(group);
      this.add(group.mesh);
    }
  }

  getMaxAge() {
    let ages = []
    this.jsonInput.forEach((json) => {
      json.emitters.forEach((e) => {
        let age = isBlank(e.maxAge) || isBlank(e.maxAge.value) ? 2 : e.maxAge.value
        ages.push(age)
      })
    })
    let max = Math.max(...ages)
    return max
  }

  setActiveMultiplier(value) {
    if (isBlank(value)) { value = 1 }
    if (value === this.lastActiveMultiplier) { return }
    this.lastActiveMultiplier = value
    this.emitters.forEach((e) => {
      e.activeMultiplier = value
    })
  }

  enable() {
    this.emitters.forEach((e) => {
      e.enable()
    })
  }

  disable() {
    this.emitters.forEach((e) => {
      e.disable()
    })
  }

  // Used to animate the particle
  //
  // Should normally be called in scene.tick
  //
  // we don't need to render according to tpf because
  // that desyncs the animation
  tick(tpf) {
    Array.from(this.groups).map((group) => {
      group.tick(tpf);
    })
  }
}
