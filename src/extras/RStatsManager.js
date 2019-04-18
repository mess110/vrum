class RStatsManager {
  constructor() {
    this.glS = new glStats(); // init at any point
    this.tS = new threeStats( Hodler.get('renderer') ); // init after WebGLRenderer is created
    this.rS = new rStats( {
        CSSPath: '/src/vendor/',
        values: {
            frame: { caption: 'Total frame time (ms)', over: 16 },
            fps: { caption: 'Framerate (FPS)', below: 30 },
            calls: { caption: 'Calls (three.js)', over: 3000 },
            raf: { caption: 'Time since last rAF (ms)' },
            rstats: { caption: 'rStats update (ms)' }
        },
        groups: [
            { caption: 'Framerate', values: [ 'fps', 'raf' ] },
            { caption: 'Frame Budget', values: [ 'frame', 'texture', 'setup', 'render' ] }
        ],
        fractions: [
            { base: 'frame', steps: [ 'action1', 'render' ] }
        ],
        plugins: [
            this.tS,
            this.glS
        ]
    } );
  }

  static startMeasure() {
    if (isBlank(RStatsManager.instance)) { return }
    let inst = RStatsManager.instance

    inst.rS( 'frame' ).start();
    inst.glS.start();

    inst.rS( 'frame' ).start();
    inst.rS( 'rAF' ).tick();
    inst.rS( 'FPS' ).frame();

    inst.rS( 'action1' ).start();
  }

  static midMeasure() {
    if (isBlank(RStatsManager.instance)) { return }
    let inst = RStatsManager.instance

    inst.rS( 'action1' ).end();
    inst.rS( 'render' ).start();
  }

  static endMeasure() {
    if (isBlank(RStatsManager.instance)) { return }
    let inst = RStatsManager.instance
    inst.rS( 'render' ).end();

    inst.rS( 'frame' ).end();
    inst.rS().update();
  }

  static toggleStats() {
    RStatsManager.instance = new RStatsManager()
  }
}
