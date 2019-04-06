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
    this.addZ = true
    this.drawLines = false
    this.collidables = collidables
    this.lineLength = 3
  }

  scan(fromPosition, velocity) {
    this.addX = true
    this.addZ = true

    if (this.drawLine(fromPosition, new THREE.Vector3(1, 0, 0)) && velocity.x > 0) {
      this.addX = false
    }

    if (this.drawLine(fromPosition, new THREE.Vector3(-1, 0, 0)) && velocity.x < 0) {
      this.addX = false
    }

    if (this.drawLine(fromPosition, new THREE.Vector3(0, 0, 1)) && velocity.z > 0) {
      this.addZ = false
    }

    if (this.drawLine(fromPosition, new THREE.Vector3(0, 0, -1)) && velocity.z < 0) {
      this.addZ = false
    }

    // if (this.drawLine(fromPosition, new THREE.Vector3(1, 0, 1)) && (velocity.x > 0 && velocity.z > 0)) {
      // this.addX = false
      // this.addZ = false
    // }
    // if (this.drawLine(fromPosition, new THREE.Vector3(-1, 0, 1)) && (velocity.x < 0 && velocity.z > 0)) {
      // this.addX = false
      // this.addZ = false
    // }
    // if (this.drawLine(fromPosition, new THREE.Vector3(1, 0, -1)) && (velocity.x > 0 && velocity.z < 0)) {
      // this.addX = false
      // this.addZ = false
    // }
    // if (this.drawLine(fromPosition, new THREE.Vector3(-1, 0, -1)) && (velocity.x < 0 && velocity.z < 0)) {
      // this.addX = false
      // this.addZ = false
    // }
  }

  addCollidable(obj) {
    if (isBlank(obj.boundingCube)) {
      this.collidables.push(obj)
    } else {
      this.collidables.push(obj.boundingCube)
    }
  }

  drawLine(fromPosition, direction) {
    let length = this.lineLength
    let inters = Measure.intersectsFrom(this.raycaster, this.collidables, fromPosition, direction, length)
    let color = inters ? 'red' : 'green'
    if (this.drawLines) {
      Measure.addLineDirection(fromPosition, direction, length, color)
    }
    return color == 'red'
  }
}
