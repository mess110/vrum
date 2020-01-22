/*
 * Example usage:
 *
 * let starfield = new Starfield()
 * this.add(starfield)
 */
class Starfield extends THREE.Points {
  constructor() {
    //This will add a starfield to the background of a scene
    var starsGeometry = new THREE.Geometry();

    for ( var i = 0; i < 10000; i ++ ) {

      var star = new THREE.Vector3();
      star.x = THREE.Math.randFloatSpread( 2000 );
      star.y = THREE.Math.randFloatSpread( 2000 );
      star.z = THREE.Math.randFloatSpread( 2000 );

      starsGeometry.vertices.push( star );
    }

    var starsMaterial = new THREE.PointsMaterial( { color: 0xFAFAD2 } );

    super(starsGeometry, starsMaterial)
  }
}
