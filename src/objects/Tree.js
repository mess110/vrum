/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// https://github.com/lmparppei/deadtree/blob/master/deadtree.js
//
// @example
//   wind = new Tree()
//   @wind = 0
//
//   @wind += tpf + Math.random() # shaky
//   @wind = tpf + Math.random() # bend
//
//   @tree.wind(@wind)
//
class Tree extends THREE.Object3D {
  constructor(material, size, children){
    super()

    if (size == null) { size = 1; }
    if (children == null) { children = 5; }

    if (material == null) { throw 'missing material' }

    const sizeModifier = .65;
    this.branchPivots = [];

    this.add(this.createBranch(size, material, children, false, sizeModifier))

    this.wind = 0
  }

  createBranch(size, material, children, isChild, sizeModifier) {
    const branchPivot = new (THREE.Object3D);
    const branchEnd = new (THREE.Object3D);
    this.branchPivots.push(branchPivot);
    const length = (Math.random() * size * 10) + (size * 5);
    const endSize = children === 0 ? 0 : size * sizeModifier;
    const branch = new (THREE.Mesh)(new (THREE.CylinderGeometry)(endSize, size, length, 5, 1, true), material);
    branchPivot.add(branch);
    branch.add(branchEnd);
    branch.position.y = length / 2;
    branchEnd.position.y = (length / 2) - (size * .4);
    if (isChild) {
      branchPivot.rotation.z += (Math.random() * 1.5) - (sizeModifier * 1.05);
      branchPivot.rotation.x += (Math.random() * 1.5) - (sizeModifier * 1.05);
    } else {
      branchPivot.rotation.z += (Math.random() * .1) - .05;
      branchPivot.rotation.x += (Math.random() * .1) - .05;
    }
    if (children > 0) {
      let c = 0;
      while (c < children) {
        const child = this.createBranch(size * sizeModifier, material, children - 1, true, sizeModifier);
        branchEnd.add(child);
        c++;
      }
    }
    return branchPivot;
  }

  // @wind += tpf + Math.random() # shaky
  // @wind = tpf + Math.random() # bend
  tick(wind) {
    this.wind = wind
    return Array.from(this.branchPivots).map((b) =>
      (b.rotation.z += Math.cos(wind * Math.random()) * 0.0005));
  }
}
