class BaseParticle extends THREE.Object3D {
  constructor(input) {
    super()

    input = arrayOrStringToString(input)

    let jsonInput;
    this.groups = [];

    eval(`jsonInput = ${input}`);
    if (jsonInput == null) { jsonInput = []; }

    for (let json of Array.from(jsonInput)) {
      const group = new (SPE.Group)(json);
      for (let emitJson of Array.from(json.emitters)) {
        const emitter = new (SPE.Emitter)(emitJson);
        group.addEmitter(emitter);
      }
      this.groups.push(group);
      this.add(group.mesh);
    }
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
