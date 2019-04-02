/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Base class for LightningBolt
class Bolt extends THREE.Line {
  constructor(src, dest, thickness, color, density, circumference) {
    if (thickness == null) { thickness = 1; }
    if (color == null) { color = 0x0000ff; }
    if (density == null) { density = 1; }
    if (circumference == null) { circumference = 1; }

    const material = new (THREE.LineBasicMaterial)({transparent: true, color: color, linewidth: thickness});
    const geometry = new (THREE.Geometry);
    super(geometry, material);

    this.src = src;
    this.dest = dest;
    this.color = color;
    this.thickness = thickness;
    this.density = density;
    this.circumference = circumference;

    const results = LightningBolt.createBolt(this.src, this.dest, this.thickness, this.density, this.circumference);
    this.setSegments(results);
  }

  strike(src, dest) {
    if (src == null) { ({ src } = this); }
    if (dest == null) { ({ dest } = this); }
    this.src = src;
    this.dest = dest;
    return this.setSegments(LightningBolt.createBolt(src, dest, this.thickness, this.density, this.circumference));
  }

  setSegments(lines) {
    const geometry = new THREE.Geometry();

    const vertices = [];
    for (let line of Array.from(lines)) {
      if (vertices.indexOf(line.src) === -1) {
        vertices.push(line.src);
      }
      if (vertices.indexOf(line.dest) === -1) {
        vertices.push(line.dest);
      }
    }

    geometry.vertices = vertices;
    geometry.verticesNeedUpdate = true;
    return this.geometry = geometry;
  }

  getPointOnBolt(percentage) {
    let dest, src;
    const pointIndex = percentage * ( this.geometry.vertices.size() - 1 );
    let rounded = Math.round(pointIndex);
    if (parseInt(pointIndex) === rounded) {
      if (rounded === 0) { rounded = 1; }
      src = this.geometry.vertices[rounded - 1];
      dest = this.geometry.vertices[rounded];
    } else {
      if (rounded === (this.geometry.vertices.size() - 1)) { rounded = this.geometry.vertices.size() - 2; }
      src = this.geometry.vertices[rounded];
      dest = this.geometry.vertices[rounded + 1];
    }
    return this.getPointInBetweenByPerc(src, dest, 0.5);
  }

  getPointInBetweenByPerc(pointA, pointB, percentage) {
    let dir = pointB.clone().sub(pointA);
    const len = dir.length();
    dir = dir.normalize().multiplyScalar(len * percentage);
    return pointA.clone().add(dir);
  }

  static createBolt(src, dest, thickness, density, circumference) {
    let i;
    let asc, end;
    const results = [];

    const tangent = dest.clone().sub(src.clone());
    const normal = new THREE.Vector3(tangent.y, -tangent.x, tangent.z).normalize();
    const length = Measure.distanceBetween(src, dest);

    let positions = [0];
    for (i = 0, end = ((length / 4)) * density, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      positions.push(Math.random());
    }
    positions = positions.sort();

    const sway = 80;
    const jaggedness = 1 / sway / circumference;

    let prevPoint = src.clone();
    let prevDisplacement = 0;
    let prevDisplacementZ = 0;

    i = 0;
    for (let pos of Array.from(positions)) {
      if (i === 0) {
        i += 1;
        continue;
      }
      const scale = (length * jaggedness) * (pos - positions[i - 1]);
      const envelope = pos > .95 ? 20 * (1 - pos) : 1;

      let displacement = Utils.random(-sway, sway) + Math.random();
      displacement -= (displacement - prevDisplacement) * (1 - scale);
      displacement *= envelope;

      let displacementZ = Utils.random(-sway, sway) + Math.random();
      displacementZ -= (displacementZ - prevDisplacementZ) * (1 - scale);
      displacementZ *= envelope;

      const x = src.x + (pos * tangent.x) + (displacement * normal.x);
      const y = src.y + (pos * tangent.y) + (displacement * normal.y);
      let z = src.z + (pos * tangent.z) + (displacement * normal.z);
      z = displacementZ;
      const point = new THREE.Vector3(x, y, z);

      results.push({
        src: prevPoint,
        dest: point
      });

      prevPoint = point;
      prevDisplacement = displacement;
      prevDisplacementZ = displacementZ;

      i += 1;
    }

    results.push({
      src: prevPoint,
      dest
    });

    return results;
  }
}

class LightningBolt extends Bolt {
  constructor(src, dest, thickness, color, density, circumference) {
    if (thickness == null) { thickness = 1; }
    if (color == null) { color = 0x0000ff; }
    if (density == null) { density = 1; }
    super(src, dest, thickness, color, density, circumference);

    this.opacity = 0;
    this.bolts = [];
    this.numBranches = 0;
  }

  addBranch(thickness, color, density, circumference){
    this.numBranches += 1;
    const newBolt = new LightningBolt(new THREE.Vector3(), new THREE.Vector3(), thickness, color, density, circumference);
    this.bolts.push(newBolt);
    this.add(newBolt);
    return newBolt;
  }

  _getBranchPoints() {
    const branchPoints = [];
    for (let i = 0, end = this.numBranches, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      branchPoints.push(Math.random());
    }
    return branchPoints.sort();
  }

  _getTargetBranchPoint(bolt) {
    const branchPoints = this._getBranchPoints();
    return branchPoints[this.bolts.indexOf(bolt)];
  }

  getChildBoltStart(bolt) {
    const targetBranchPoint = this._getTargetBranchPoint(bolt);
    return this.getPointOnBolt(targetBranchPoint);
  }

  getChildBoltEnd(bolt) {
    const targetBranchPoint = this._getTargetBranchPoint(bolt);
    const boltSrc = this.getChildBoltStart(bolt);

    const diff = new THREE.Vector3(this.dest.x - this.src.x, this.dest.y - this.src.y, this.dest.z - this.src.z);
    // diff = new THREE.Vector3(bolt.dest.x - bolt.src.x, bolt.dest.y - bolt.src.y, bolt.dest.z - bolt.src.z)
    const x = (diff.x * (1 - targetBranchPoint)) + boltSrc.x;
    const y = (diff.y * (1 - targetBranchPoint)) + boltSrc.y;
    const z = (diff.z * (1 - targetBranchPoint)) + boltSrc.z;
    return new THREE.Vector3(x, y, z);
  }

  strike(src, dest) {
    super.strike(src, dest);
    return (() => {
      const result = [];
      for (let bolt of Array.from(this.bolts)) {
        const boltSrc = this.getChildBoltStart(bolt);
        const boltEnd = this.getChildBoltEnd(bolt);
        result.push(bolt.strike(boltSrc, boltEnd));
      }
      return result;
    })();
  }
}

// Class which simulates lightning
//
// @param src - start point
// @param dest - dest point
// @param thickness - how thick the bolt is
// @param color - the color of the bolt
// @param density - how many changes of direction in one bolt
// @param circumference - how much the bolt spreads
// @param addBranches - callback instead of overrding addBranches
//
// @example
//   line = new BranchLightning(
//     new (THREE.Vector3)(0, 10, 0),
//     new (THREE.Vector3)(0, 0, 0),
//     3, 'white', 50, 1, (parentBolt) ->
//       for i in [0...1]
//         newBolt = parentBolt.addBranch(parentBolt.thickness / 2, 'yellow', parentBolt.density / 2, parentBolt.circumference)
//         for j in [0...1]
//           newBolt.addBranch(newBolt.thickness / 3, 'orange', newBolt.density / 3, newBolt.circumference)
//   )
//
// @example
//   class MyBolt extends BranchLightning
//     addBranches: ->
//       for i in [0...1]
//         newBolt = addBranch(@thickness / 2, 'yellow', @density / 2, @circumference)
//         for j in [0...1]
//           newBolt.addBranch(@thickness / 3, 'orange', @density / 3, @circumference)
//
//   line = new MyBolt(
//     new (THREE.Vector3)(0, 10, 0),
//     new (THREE.Vector3)(0, 0, 0),
//     3, 'white', 10, 1
//   )
//
// @example
//   LightningBolt::getChildBoltEnd = (bolt) ->
//     @dest
class BranchLightning extends LightningBolt {
  constructor(src, dest, thickness, color, density, circumference, addBranches) {
    super(src, dest, thickness, color, density, circumference);
    if (addBranches != null) {
      addBranches(this);
    } else {
      this.addBranches(this);
    }
    this.strike();
  }

  // Override this method to configure how the lightning bolt looks like
  addBranches(parentBolt) {
    return (() => {
      const result = [];
      for (let i = 0; i < 4; i++) {
        var newBolt = parentBolt.addBranch(parentBolt.thickness / 2, 'yellow', parentBolt.density / 2, parentBolt.circumference);
        result.push([0, 1].map((j) =>
          newBolt.addBranch(newBolt.thickness / 3, 'orange', newBolt.density / 3, newBolt.circumference)));
      }
      return result;
    })();
  }
}
