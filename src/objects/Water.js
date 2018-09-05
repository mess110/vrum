// this.water = new Water({
//   width: 100,
//   height: 100,
//   map: 'waternormals.jpg',
//   water: {
//     alpha: 0.8,
//     waterColor: 0x001e0f
//   }
// })
// this.add(this.water)
//
// this.water.tick(tpf)
// this.water.setSunDirection(this.sky.light)
class Water extends THREE.Mesh {
  constructor(options) {
    if (options == null) { options = {}; }
    if (options.map == null) { throw new Error('map missing. needs to be a AssetManager key'); }
    if (options.width == null) { options.width = Utils.PLANE_DEFAULT_WIDTH; }
    if (options.height == null) { options.height = Utils.PLANE_DEFAULT_HEIGHT; }
    if (options.wSegments == null) { options.wSegments = Utils.PLANE_DEFAULT_W_SEGMENTS; }
    if (options.hSegments == null) { options.hSegments = Utils.PLANE_DEFAULT_H_SEGMENTS; }
    if (options.water == null) { options.water = {}; }
    if (options.water.textureWidth == null) { options.water.textureWidth = Utils.MIRROR_DEFAULT_TEXTURE_WIDTH; }
    if (options.water.textureHeight == null) { options.water.textureHeight = Utils.MIRROR_DEFAULT_TEXTURE_HEIGHT; }
    if (options.water.alpha == null) { options.water.alpha = Utils.WATER_DEFAULT_ALPHA; }
    if (options.water.sunColor == null) { options.water.sunColor = Utils.LIGHT_DEFAULT_COLOR; }
    if (options.water.waterColor == null) { options.water.waterColor = Utils.WATER_DEFAULT_WATER_COLOR; }
    if (options.water.betaVersion == null) { options.water.betaVersion = 0; }
    if (options.water.side == null) { options.water.side = THREE.DoubleSide; }

    const waterNormals = AssetManager.get(options.map)
    waterNormals.wrapS = (waterNormals.wrapT = THREE.RepeatWrapping)
    options.water.waterNormals = waterNormals;

    let renderer = Hodler.get('renderer')
    let camera = Hodler.get('camera')
    let scene = Hodler.get('scene')
    let water = new (THREE.Water)(renderer, camera, scene, options.water);

    super(new (THREE.PlaneBufferGeometry)(options.width, options.height, options.wSegments, options.hSegments), water.material);
    this.add(water)
    this.rotation.x = -Math.PI * 0.5
    this.speed = 1
    this.water = water
  }

  // Used to update the water animation.
  //
  // Should be called in scene.tick
  tick(tpf) {
    this.water.material.uniforms.time.value += tpf * this.speed;
    this.water.render();
  }

  setSunDirection(light) {
    this.water.material.uniforms.sunDirection.value.copy(light.position).normalize()
  }
}
