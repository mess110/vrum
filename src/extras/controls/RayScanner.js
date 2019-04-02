/*
 * Example usage:
 *
 *  let fromPosition = this.tank.position.clone()
 *  fromPosition.y += 2
 *
 *  this.rayScanner.scan(
 *    [this.island, this.barrel, this.wall],
 *    fromPosition, this.control.velocity
 *  )
 *
 *  if (this.rayScanner.addX) { this.tank.position.x += this.control.velocity.x }
 *  if (this.rayScanner.addZ) { this.tank.position.z += this.control.velocity.z }
 *
 */
class RayScanner {
  constructor() {
    this.raycaster = new THREE.Raycaster()
    this.addX = true
    this.addZ = true
    this.drawLines = false
  }

  scan(objects, fromPosition, velocity) {
    this.addX = true
    this.addZ = true

    if (this.drawLine(fromPosition, new THREE.Vector3(1, 0, 0), objects) && velocity.x > 0) {
      this.addX = false
    }
    if (this.drawLine(fromPosition, new THREE.Vector3(-1, 0, 0), objects) && velocity.x < 0) {
      this.addX = false
    }
    if (this.drawLine(fromPosition, new THREE.Vector3(0, 0, 1), objects) && velocity.z > 0) {
      this.addZ = false
    }
    if (this.drawLine(fromPosition, new THREE.Vector3(0, 0, -1), objects) && velocity.z < 0) {
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

  drawLine(fromPosition, direction, objects) {
    let length = 4
    let color = Measure.intersectsFrom(this.raycaster, objects, fromPosition, direction, length) ? 'red' : 'green'
    if (this.drawLines) {
      Measure.addLineDirection(fromPosition, direction, length, color)
    }
    return color == 'red'
  }
}
