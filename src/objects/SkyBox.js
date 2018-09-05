// this.skyBox = new SkyBox(
// [
// '/workspace/assets/px.jpg',
// '/workspace/assets/nx.jpg',
// '/workspace/assets/py.jpg',
// '/workspace/assets/ny.jpg',
// '/workspace/assets/pz.jpg',
// '/workspace/assets/nz.jpg',
// ]
// )
// this.add(this.skyBox)
class SkyBox extends THREE.Mesh {
  constructor(imgUrls, size) {
    if (size == null) { size = 900000; }
    const aCubeMap = THREE.ImageUtils.loadTextureCube(imgUrls);
    aCubeMap.format = THREE.RGBFormat;
    const aShader = THREE.ShaderLib['cube'];
    aShader.uniforms['tCube'].value = aCubeMap;
    const aSkyBoxMaterial = new (THREE.ShaderMaterial)({
      fragmentShader: aShader.fragmentShader,
      vertexShader: aShader.vertexShader,
      uniforms: aShader.uniforms,
      depthWrite: false,
      side: THREE.BackSide});
    super(new (THREE.BoxGeometry)(size, size, size), aSkyBoxMaterial)
  }
}
