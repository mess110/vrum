/*
 * Example usage:
 *
 *  let rayScanner = new RayScanner([this.island, this.barrel, this.wall])
 *  // rayScanner.collidables = [...]
 *  // rayScanner.drawLines = true
 *  this.rayScanner = rayScanner
 *
 *  // in tick(tpf)
 *  let fromPosition = this.tank.position.clone()
 *  fromPosition.y += 2
 *  this.rayScanner.scan(fromPosition, this.control.velocity)
 *
 *  if (this.rayScanner.addX) { this.tank.position.x += this.control.velocity.x }
 *  if (this.rayScanner.addZ) { this.tank.position.z += this.control.velocity.z }
 *
 */
class RayScanner {
  constructor(collidables) {
    this.raycaster = new THREE.Raycaster()
    this.addX = true
    this.addY = true
    this.addZ = true
    this.drawLines = false
    this.collidables = collidables
    this.lineLength = 3
  }

  scan(fromPosition, velocity) {
    this.addX = true
    this.addY = true
    this.addZ = true

    if (this.intersects(fromPosition, new THREE.Vector3(1, 0, 0)) && velocity.x > 0) {
      this.addX = false
    }

    if (this.intersects(fromPosition, new THREE.Vector3(-1, 0, 0)) && velocity.x < 0) {
      this.addX = false
    }

    if (this.intersects(fromPosition, new THREE.Vector3(0, 1, 0)) && velocity.y < 0) {
      this.addY = false
    }

    if (this.intersects(fromPosition, new THREE.Vector3(0, -1, 0)) && velocity.y > 0) {
      this.addY = false
    }

    if (this.intersects(fromPosition, new THREE.Vector3(0, 0, 1)) && velocity.z > 0) {
      this.addZ = false
    }

    if (this.intersects(fromPosition, new THREE.Vector3(0, 0, -1)) && velocity.z < 0) {
      this.addZ = false
    }
  }

  scanEdgesBottom(fromPosition, halfWidth) {
    let from1 = fromPosition.clone()
    from1.x -= halfWidth
    let from2 = fromPosition.clone()
    from2.x += halfWidth
    let interDown = this.getIntersects(from1, new THREE.Vector3(0, -1, 0))
    let interDown2 = this.getIntersects(from2, new THREE.Vector3(0, -1, 0))
    return interDown.concat(interDown2)
  }

  addCollidable(obj) {
    if (isBlank(obj.boundingCube)) {
      this.collidables.pushUnique(obj)
    } else {
      this.collidables.pushUnique(obj.boundingCube)
    }
  }

  removeCollidable(obj) {
    if (isBlank(obj.boundingCube)) {
      this.collidables.remove(obj)
    } else {
      this.collidables.remove(obj.boundingCube)
    }
  }

  intersects(fromPosition, direction) {
    let length = this.lineLength
    let inters = Measure.intersectsFrom(this.raycaster, this.collidables, fromPosition, direction, length)

    let color = inters ? 'red' : 'green'
    if (this.drawLines) {
      Measure.addLineDirection(fromPosition, direction, length, color)
    }

    return inters
  }

  getIntersects(fromPosition, direction) {
    let length = this.lineLength
    let inters = Measure.getIntersectionsFrom(this.raycaster, this.collidables, fromPosition, direction, length)

    let color = inters.any() ? 'red' : 'green'
    if (this.drawLines) {
      Measure.addLineDirection(fromPosition, direction, length, color)
    }

    return inters
  }
}
