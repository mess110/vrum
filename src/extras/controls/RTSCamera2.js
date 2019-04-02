// https://github.com/yomotsu/camera-controls
class RTSCamera2 {
  constructor() {
    this.touch = Utils.isMobileOrTablet()

    CameraControls.install( { THREE: THREE } );
    const cameraControls = new CameraControls(Hodler.get('camera'), Hodler.get('renderer').domElement);
    this.cameraControls = cameraControls
  }

  tick(tpf) {
    this.cameraControls.update(tpf);
  }
}
