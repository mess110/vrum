/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Creates and adds a heightmap to the current scene
//
// @example
//   Terrain.heightmap('/node_modules/ocean/assets/img/waternormals.jpg', 'heightmap.png', 20, 20, 5, 5)
//
// @example
//   hm = THREE.ImageUtils.loadTexture(options.heightmapUrl)
//   hm.heightData = Terrain.getHeightData(hm.image, options.scale)
//   terrain = new Terrain(options.textureUrl, options.width, options.height, options.wSegments, options.hSegments)
//   terrain.applyHeightmap(hm.heightData)
//
// @example
//   # assuming you are using a LoadingScene
//   json = SaveObjectManager.get().items['terrain']
//   @scene.add Terrain.fromJson(json).mesh
//
class Terrain extends THREE.Mesh {

  // Creates the terrain
  constructor(json){
    let mat = new THREE.MeshLambertMaterial({
      map: AssetManager.get(json.texture.destPath),
      side: THREE.DoubleSide
    });
    let geom = new (THREE.PlaneGeometry)(json.width, json.height, json.wSegments, json.hSegments);

    super(geom, mat)
    this.rotation.x -= Math.PI / 2;

    this.raycaster = new (THREE.Raycaster);
  }

  // Get height at a specific position.
  //
  // A ray is cast from the top of the position returning the height at the
  // intersection point
  //
  // @example
  //   height = @terrain.getHeightAt(@cube.position)
  //   @cube.position.y = height
  getHeightAt(position) {
    this.raycaster.set(new THREE.Vector3(position.x, 1000, position.z), Helper.down);
    const intersects = this.raycaster.intersectObject(this);
    if (intersects[0] != null) { return intersects[0].point.y; } else { return 0; }
  }

  // Apply heightmap data retrieved from getHeightData
  //
  // @see getHeightData
  applyHeightmap(imageData) {
    let i = 0;
    return (() => {
      const result = [];
      for (let vertice of Array.from(this.geometry.vertices)) {
        vertice.z = imageData[i];
        result.push(i++);
      }
      return result;
    })();
  }

  // Returns height data of an Image object
  //
  // @param [Image] img
  // @param [Number] scale
  static getHeightData(img, scale) {
    if (scale == null) { scale = 1; }
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    const size = img.width * img.height;
    const data = new Float32Array(size);
    context.drawImage(img, 0, 0);
    let i = 0;
    while (i < size) {
      data[i] = 0;
      i++;
    }
    const imgd = context.getImageData(0, 0, img.width, img.height);
    const pix = imgd.data;
    let j = 0;
    i = 0;
    while (i < pix.length) {
      const all = pix[i] + pix[i + 1] + pix[i + 2];
      data[j++] = all / (12 * scale);
      i += 4;
    }
    return data;
  }

  // Propper way to load a terrain using TextureManager
  //
  // @param [Object] json
  static fromJson(json) {
    // TODO: validate is terrain

    for (var key of ['width', 'height', 'scale', 'texture', 'heightmap']) {
      if (json[key] == null) { throw new Error(`${key} missing for terrain`); }
    }
    for (key of ['texture', 'heightmap']) {
      if (json[key].destPath == null) { throw new Error(`${key}.destPath missing for terrain`); }
    }

    const hm = AssetManager.get(json.heightmap.destPath)
    hm.heightData = Terrain.getHeightData(hm.image, json.scale);
    if (json.wSegments == null) { json.wSegments = hm.image.width - 1; }
    if (json.hSegments == null) { json.hSegments = hm.image.height - 1; }
    const terrain = new Terrain(json);
    terrain.applyHeightmap(hm.heightData);
    return terrain;
  }
}
