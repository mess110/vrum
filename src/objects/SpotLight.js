/*
! * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Uses THREEx.VolumetricSpotLightMaterial to create a spotlight effect
//
// @example
//   spotLight = new SpotLight(0, 10, 0)
//   spotLight.addToScene(scene)
//   spotLight.lookAt(new (THREE.Vector3)(0, 0, 0))
//
// @see https://github.com/jeromeetienne/threex.volumetricspotlight
class SpotLight extends THREE.Mesh {
  // Creates a new spotlight
  //
  // @param [Number] x - start z position
  // @param [Number] y - start y position
  // @param [Number] z - start x position
  constructor(x, y, z, r1, r2, height) {
    if (r1 == null) { r1 = 0.1; }
    if (r2 == null) { r2 = 2.5; }
    if (height == null) { height = 5; }
    const geometry = new (THREE.CylinderGeometry)(r1, r2, height, 32 * 2, 40, true);
    geometry.applyMatrix((new (THREE.Matrix4)).makeTranslation(0, -geometry.parameters.height / 2, 0));
    geometry.applyMatrix((new (THREE.Matrix4)).makeRotationX(-Math.PI / 2));
    const material = new (THREEx.VolumetricSpotLightMaterial);

    super(geometry, material)
    this.position.set(x, y, z);
    this.setColor('white');
    this.material.uniforms.spotPosition.value = this.position; // TODO: cleanup

    this.spotLight = new THREE.SpotLight();
    this.spotLight.position.copy(this.position);
    this.spotLight.color = this.material.uniforms.lightColor.value;

    this.direction = new (THREE.Vector3)(0,0,0);
    this.lastDir = 0;

    this.lookAt(new (THREE.Vector3)(0, 0, 0));

    this.cameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera)
    this.cameraHelper.visible = false
  }

  // Make the spotlight look at a node's position
  //
  // @param [Object] node
  lookAt(target) {
    super.lookAt(target)
    this.spotLight.target.position.copy(target);
  }

  // A helper which aims to make it easy to add spotlights and related
  // objects to the scene
  addToScene(scene) {
    scene.add(this);
    scene.add(this.spotLight);
    scene.add(this.cameraHelper);
    scene.add(this.spotLight.target);
  }

  // Sets the spotlight color
  //
  // @param [String] color
  //
  // @example
  //
  //   spotLight.setColor('white')
  //   spotLight.setColor('#ffffff')
  setColor(color) {
    return this.material.uniforms.lightColor.value.set(color);
  }
}
