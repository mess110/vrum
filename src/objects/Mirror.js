class Mirror extends THREE.Reflector {
  constructor (options) {
    let renderer = Hodler.get('renderer');
    let camera = Hodler.get('camera');

    if (options == null) { options = {}; }
    if (options.width == null) { options.width = Utils.PLANE_DEFAULT_WIDTH; }
    if (options.height == null) { options.height = Utils.PLANE_DEFAULT_HEIGHT; }
    if (options.mirror == null) { options.mirror = {}; }
    if (options.mirror.clipBias == null) { options.mirror.clipBias = Utils.MIRROR_DEFAULT_CLIP_BIAS; }
    if (options.mirror.textureWidth == null) { options.mirror.textureWidth = renderer.getSize().width * camera.aspect }
    if (options.mirror.textureHeight == null) { options.mirror.textureHeight = renderer.getSize().height * camera.aspect }
    if (options.mirror.color == null) { options.mirror.color = Utils.MIRROR_DEFAULT_COLOR; }
    if (options.mirror.recursion == null) { options.mirror.color = Utils.MIRROR_DEFAULT_RECURSION; }

    var geometry = new THREE.PlaneBufferGeometry(options.width, options.height);
    super(geometry, options.mirror)
  }
}
