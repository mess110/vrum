// this.sky = new Sky();
// this.sky.addToScene(scene)
// this.sky.updateSun(this.sky.distance, this.sky.inclination, this.sky.azimuth)
class Sky extends THREE.Sky {
  constructor() {
    super()
    this.defaults()
  }

  defaults() {
    this.distance = 400
    this.inclination = 0.40
    this.azimuth = 0.205

    this.scale.setScalar(10000)
    this.material.uniforms.turbidity.value = 10
    this.material.uniforms.rayleigh.value = 2
    this.material.uniforms.luminance.value = 1
    this.material.uniforms.mieCoefficient.value = 0.005
    this.material.uniforms.mieDirectionalG.value = 0.8

    this.light = new THREE.DirectionalLight(0xffffff, 0.8)
    this.setLightShadowMapSize(512, 512)
    this.cameraHelper = new THREE.CameraHelper(this.light.shadow.camera)
    this.cameraHelper.visible = false

    this.updateSun(this.distance, this.inclination, this.azimuth)
  }

  updateSun(distance, inclination, azimuth) {
    if (inclination < 0) { inclination = 0 }
    if (inclination > 0.5) { inclination = 0.5 }
    if (azimuth < 0) { azimuth = 0.5 }
    if (azimuth > 1) { azimuth = 1 }

    this.distance = distance
    this.inclination = inclination
    this.azimuth = azimuth

    var theta = Math.PI * ( inclination - 0.5 )
    var phi = 2 * Math.PI * ( azimuth - 0.5 )

    var x = distance * Math.cos( phi )
    var y = distance * Math.sin( phi ) * Math.sin( theta )
    var z = distance * Math.sin( phi ) * Math.cos( theta )

    this.light.position.set(x, y, z)

    var position = new THREE.Vector3(x, y, z)
    this.material.uniforms.sunPosition.value = this.light.position.copy(this.light.position)
  }

  setLightShadowMapSize(width, height) {
    this.light.shadow.mapSize.width = width
    this.light.shadow.mapSize.height = height
  }

  addToScene(scene) {
    scene.add(this)
    scene.add(this.light)
    scene.add(this.cameraHelper)
  }
}
