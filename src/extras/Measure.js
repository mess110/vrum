// what do I want to do?
//
//  * get distance between two points
//  * draw line between two points
//
//  * is there an intersection from a point/object in a given direction for a given distance
//  * draw line between point and direction/distance - you can actually get the point
// sets direction in the world vector
// return this.mesh.getWorldDirection(this.direction)
class Measure {
  static getCenterPoint(mesh) {
    var geometry = mesh.geometry;
    geometry.computeBoundingBox();
    var center = geometry.boundingBox.getCenter();
    mesh.localToWorld(center);
    return center;
  }

  static degToRadians(angle) {
    return (angle * Math.PI) / 180
  }

  static radiansToDeg(radians) {
    return radians * (180 / Math.PI)
  }

  static normalizeDegrees(angle) {
    if (angle >= 0) {
      var tempAngle = angle % 360;
      return tempAngle == 360 ? 0 : tempAngle;
    }
    else {
      return (360 - (-1 * angle)) % 360;
    }
  }

  static normalizeRadians(radians) {
    // there is a better way
    return Measure.degToRadians(Measure.normalizeDegrees(Measure.radiansToDeg(radians)))
  }

  // If the return value is positive, then rotate to the left. Else,
  // rotate to the right.
  static calcShortestRot(from, to) {
    // If from or to is a negative, we have to recalculate them.
    // For an example, if from = -45 then from(-45) + 360 = 315.
    if(from < 0) {
      from += 360;
    }

    if(to < 0) {
      to += 360;
    }

    // Do not rotate if from == to.
    if(from == to ||
      from == 0  && to == 360 ||
      from == 360 && to == 0)
    {
      return 0;
    }

    // Pre-calculate left and right.
    let left = (360 - from) + to;
    let right = from - to;
    // If from < to, re-calculate left and right.
    if(from < to)  {
      if(to > 0) {
        left = to - from;
        right = (360 - to) + from;
      } else {
        left = (360 - to) + from;
        right = to - from;
      }
    }

    // Determine the shortest direction.
    return ((left <= right) ? left : (right * -1));
  }

  static calcShortestRotDirection(from, to) {
    // If the value is positive, return true (left).
    return Measure.calcShortestRot(from, to) >= 0
  }


  // Calculate the distance between 2 vectors
  static distanceBetween(startPoint, endPoint) {
    if (isBlank(startPoint) || isBlank(endPoint)) {
      throw 'startPoint and endPoint can\'t be blank'
    }
    if (!isBlank(startPoint.position)) {
      startPoint = startPoint.position
    }
    if (!isBlank(endPoint.position)) {
      endPoint = endPoint.position
    }
    const dx = startPoint.x - (endPoint.x);
    const dy = startPoint.y - (endPoint.y);
    const dz = startPoint.z - (endPoint.z);
    return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
  }

  // An intersection plane
  //
  // @example
  //   @plane = Measure.intersectPlane()
  //   pos = raycaster.ray.intersectPlane(@plane)
  static intersectPlane() {
    return new THREE.Plane(new THREE.Vector3(0, 0, 1), -1);
  }

  static getIntersections(raycaster, objects) {
    if (isBlank(raycaster)) {
      console.error('raycaster can not be blank')
      return
    }
    if (isBlank(objects)) {
      console.error('intersection object can not be blank')
      return
    }
    if (!isArray(objects)) {
      objects = [objects]
    }
    // true because we want to check for children as well
    return raycaster.intersectObjects(objects, true)
  }

  static hasIntersections(raycaster, objects) {
    return Measure.getIntersections(raycaster, objects).any()
  }

  static getIntersectionsFrom(raycaster, objects, startPoint, direction, far) {
    if (isBlank(raycaster)) {
      console.error('raycaster can not be blank')
      return
    }
    if (isBlank(far)) { far = Infinity }
    startPoint = Measure._toPoint(startPoint)
    direction = Measure._toPoint(direction)

    raycaster.set(startPoint, direction)
    raycaster.far = far
    return Measure.getIntersections(raycaster, objects)
  }

  static hasIntersectionsFrom(raycaster, objects, startPoint, direction, far) {
    return Measure.getIntersectionsFrom(raycaster, objects, startPoint, direction, far).any()
  }

  // TODO: what was this for again?
  sensor(pointA, direction, distance) {
    if (isBlank(distance)) { distance = 100 }
    // let direction = new THREE.Vector3( 10, 0, 0 )
    direction.normalize()

    let pointB = new THREE.Vector3()
    pointB.addVectors(pointA, direction.multiplyScalar(distance))
  }

  static _toPoint(point) {
    if (isBlank(point)) {
      throw 'point can\'t be blank'
    }
    return isBlank(point.position) ? point.clone() : point.position.clone()
  }

  static addLineDirection(startPoint, direction, distance, color) {
    if (isBlank(distance)) { distance = 100 }
    if (isBlank(color)) { color = 'red' }
    startPoint = Measure._toPoint(startPoint)

    let endPoint = new THREE.Vector3()
    endPoint.addVectors(startPoint, direction.multiplyScalar(distance))
    Measure.addLineBetween(startPoint, endPoint, color)
  }

  static addLineBetween(startPoint, endPoint, color) {
    if (isBlank(color)) { color = 'red' }
    startPoint = Measure._toPoint(startPoint)
    endPoint = Measure._toPoint(endPoint)

    let geometry = new THREE.Geometry();
    geometry.vertices.push( startPoint );
    geometry.vertices.push( endPoint );
    let material = new THREE.LineBasicMaterial( { color : color, linewidth: Config.instance.measure.lineWidth } );
    let line = new THREE.Line( geometry, material );
    line.vrumMeasureLine = true
    Hodler.get('scene').add(line)
    return line
  }

  static clearLines() {
    let scene = Hodler.get('scene')
    let list = []
    scene.traverse((e) => {
      if (e instanceof THREE.Line && e.vrumMeasureLine == true) {
        list.push(e)
      }
    })
    list.forEach((e) => {
      scene.remove(e)
    })
  }
}
