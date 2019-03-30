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

  static intersects(raycaster, objects) {
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
    let intersects = raycaster.intersectObjects(objects, true)
    return intersects.first()
  }

  inter(raycaster, startPoint, direction, target) {
    raycaster.set(startPoint, direction)
    return this.intersects(raycaster, target)
  }

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
    let material = new THREE.LineBasicMaterial( { color : color } );
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

class Scene3 extends Scene {
  init(options) {
    resetCamPosition(10)

    this.terrain = Terrain.fromJson(AssetManager.get('terrain.json'))
    this.terrain.position.set(0, -1, 0)
    this.add(this.terrain)

    this.add(new THREE.AmbientLight())
    Utils.toggleOrbitControls()

    let mesh = AssetManager.clone('chicken.gltf')
    mesh.scale.setScalar(5)
    this.add(mesh)
    this.chicken = mesh

    this.control = new Control(this.chicken)

    this.velY = 0
    this.velX = 0
    this.speed = 2
    this.acceleration = 1
    this.friction = 1 // 0.98
    this.keys = []

    this.raycaster = new THREE.Raycaster()
    this.direction = new THREE.Vector3(0, -1, 0)

    let geometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 )
    let material = new THREE.MeshBasicMaterial( { color: 0x4d4d4d } )
    let cube = new THREE.Mesh( geometry, material )
    this.add(cube)
    this.point = cube
  }

  tick(tpf) {
    let velY = this.velY
    let velX = this.velX
    let speed = this.speed
    let friction = this.friction
    let acceleration = this.acceleration
    let keys = this.keys

    if (keys[38]) {
        if (velY > -speed) {
            velY -= tpf * acceleration
        }
    }

    if (keys[40]) {
        if (velY < speed) {
            velY += tpf * acceleration
        }
    }
    if (keys[39]) {
        if (velX < speed) {
            velX += tpf * acceleration
        }
    }
    if (keys[37]) {
        if (velX > -speed) {
            velX -= tpf * acceleration
        }
    }

    let y = this.chicken.position.z
    let x = this.chicken.position.x

    velY *= friction;
    y += velY;
    velX *= friction;
    x += velX;

    this.chicken.position.x = x
    this.chicken.position.z = y

    // let fromPosition = this.point.position.clone()
    // fromPosition.y = 5
    // let intersection = this.inter(this.raycaster, fromPosition, this.direction, this.terrain)
    // if (!isBlank(intersection)) {
      // this.line(fromPosition, intersection.point)
      // this.chicken.position.y = intersection.point.y
    // }
  }

  doMouseEvent(event, raycaster) {
    if (event.type != 'mousedown') { return }
    let intersection = Measure.intersects(raycaster, this.terrain)
    if (!isBlank(intersection)) {
      Measure.clearLines()
      let scene = Hodler.get('scene')
      scene.point.position.set(intersection.point.x, intersection.point.y, intersection.point.z)
      Measure.addLineBetween(scene.chicken.position, intersection.point)
      console.log(Measure.distanceBetween(scene.chicken.position, intersection.point))
      Measure.addLineDirection(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1, 0, 0))
    }
  }

  uninit() {
    Utils.toggleOrbitControls()
  }

  doKeyboardEvent(event) {
    switchScene(event)
    this.keys[event.keyCode] = event.type == "keydown"
    this.control.doKeyboardEvent(event)
  }
}
