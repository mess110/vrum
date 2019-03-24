// Example usage:
//
// let material = new ShaderMaterial('basic_shader.json', function (tpf) {
//   this.uniforms.time.value += tpf * 2
// })
// material.tick(tpf)
//
//
// let material = new ShaderMaterial('dissolve_shader.json', function (tpf) {
//   if (this.uniforms.dissolve.value > 1) {
//     this.uniforms.dissolve.value = 0
//   }
//   this.uniforms.dissolve.value += tpf
// })
// material.tick(tpf)
//
class ShaderMaterial extends THREE.ShaderMaterial {
  constructor(json, customTick) {
    if (isBlank(json)) { throw "shader is blank, missing json param" }

    if (!('tick' in json)) { throw `missing tick for shader` }
    if (!('uniforms' in json)) { throw `missing uniforms for shader` }
    if (!('vertex' in json)) { throw `missing uniforms for shader` }
    if (!('fragment' in json)) { throw `missing uniforms for shader` }

    let evalUniforms
    eval("evalUniforms = " + arrayOrStringToString(json.uniforms))

    let evalTick
    if (isBlank(customTick)) {
      eval("evalTick = " + arrayOrStringToString(json.tick))
    } else {
      if (customTick instanceof Function) {
        evalTick = customTick
      } else {
        eval("evalTick = " + arrayOrStringToString(customTick))
      }
    }

    super({
      morphTargets: true, // TODO: do we want this all the time?
      uniforms: evalUniforms,
      vertexShader: arrayOrStringToString(json.vertex),
      fragmentShader: arrayOrStringToString(json.fragment),
      flatShading: THREE.SmoothShading // TODO: do we want this all the time?
    })

    this.customTick = evalTick
  }

  tick(tpf) {
    this.customTick(tpf)
  }

  // used with dissolve_shader.json
  //
  // @example
  //   material = Helper.setDissolveMaterialColor(material, 0, 0, 1)
  static setDissolveMaterialColor(dm, r, g, b) {
    if (dm == null) { new Error('missing dm param'); }
    r = parseFloat(r).toFixed(1);
    g = parseFloat(g).toFixed(1);
    b = parseFloat(b).toFixed(1);
    dm.fragmentShader = dm.fragmentShader.replace('    color.r = 1.0; color.g = 0.5; color.b = 0.0;', `    color.r = ${r}; color.g = ${g}; color.b = ${b};`);
    return dm;
  }
}
