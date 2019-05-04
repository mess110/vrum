/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// @example
//   [].isEmpty()
Array.prototype.isEmpty = function() {
  return this.length === 0
}

// @example
//   [1].any()
Array.prototype.any = function() {
  return !this.isEmpty()
}

// @example
//   [1, 2].clear()
Array.prototype.clear = function() {
  return (() => {
    const result = []
    while (this.any()) {
      result.push(this.pop())
    }
    return result
  })()
}

// @example
//   [1, 2].last()
Array.prototype.last = function() {
  return this[this.length - 1]
}

// @example
//   [1].first()
Array.prototype.first = function() {
  return this[0]
}

// @example
//   [].size()
Array.prototype.size = function() {
  return this.length
}

// @example
//   [1, 2].includes(1)
Array.prototype.includes = function(e) {
  return this.indexOf(e) !== -1
}

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
Array.prototype.shuffle = function(modifySelf = false) {
  const array = modifySelf ? this : this.slice(0)
  let m = array.length
  let t = undefined
  let i = undefined

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element...
    i = Math.floor(Math.random() * m--)

    // And swap it with the current element.
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}

// Check if 2 arrays are equal
Array.prototype.equalsArray = function(a) {
  let eq = true
  for (let i = 0, end = a.size(), asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    if (a[i] !== this[i]) {
      eq = false
      break
    }
  }
  return eq
}

Array.prototype.random = function() {
  return this.shuffle().first()
}

// Difference between arrays
Array.prototype.diff = function(a) {
  return this.filter(i => a.indexOf(i) < 0)
}

// Remove element from an array
Array.prototype.remove = function(e) {
  const pos = this.indexOf(e)
  if (pos > -1) { this.splice(pos, 1) }
  if (pos > -1) { return e } else { return null }
}

// Find element in array with a specific id
Array.prototype.findById = function(id) {
  return this.filter(i => i.id === id)
}

// Sum all the elements of an array
Array.prototype.sum = function() {
  let sum = 0
  for (let e of Array.from(this)) {
    sum += e
  }
  return sum
}

// Query for array elements
Array.prototype.where = function(hash) {
  return this.filter(function(d) {
    let ok = true
    for (let key in hash) {
      let found = false
      if (hash[key] instanceof Array) {
        for (let item of Array.from(hash[key])) {
          if (d[key] === item) {
            found = true
            break
          }
        }
        ok = ok && found
      } else {
        ok = ok && (d[key] === hash[key])
      }
    }
    return ok
  })
}

// Add an item at a specific position
Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item)
}

Array.prototype.pushUnique = function (item) {
  if (this.indexOf(item) !== -1) { return item }
  return this.push(item)
}

Array.prototype.toCyclicArray = function() {
  return new CyclicArray(this)
}

Array.prototype.shallowClone = function() {
  return JSON.parse(JSON.stringify(this))
}

// Returns the length of a string
String.prototype.size = function(s) {
  return this.length
}

// Checks if a string s starts with another string
String.prototype.startsWith = function(s) {
  return this.indexOf(s) === 0
}

// Checks if an string starts with any of the prefixes.
// The prefixes is an array of strings
String.prototype.startsWithAny = function(prefixes) {
  let startsWith = false
  for (let prefix of Array.from(prefixes)) {
    if (this.startsWith(prefix)) { startsWith = true }
  }
  return startsWith
}

// Checks if a string ends with another string
//
// @param [String] suffix
String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - (suffix.length)) !== -1
}

// Checks if an array ends with any of the suffixes
//
// @param [Array] suffixes
String.prototype.endsWithAny = function(suffixes) {
  let endsWith = false
  if (suffixes == null) { return false }
  for (let suffix of Array.from(suffixes)) {
    if (this.endsWith(suffix)) { endsWith = true }
  }
  return endsWith
}

// Replaces any of the sources as dest String
//
// @param [Array] sources
// @param [String] dest
String.prototype.replaceAny = function(sources, dest) {
  let tmp = this
  for (let source of Array.from(sources)) {
    tmp = tmp.replace(source, dest)
  }
  return tmp
}

// Checks if a string has size 0
String.prototype.isEmpty = function() {
  return this.size() === 0
}

// Checks if a string contains a substring
String.prototype.contains = function(s) {
  return this.indexOf(s) !== -1
}

String.prototype.containsAny = function(strings) {
  let containsAny = false
  if (strings == null) { return false }
  for (let s of Array.from(strings)) {
    if (this.contains(s)) { containsAny = true }
  }
  return containsAny
}

// Checks if a string is not empty
String.prototype.isPresent = function() {
  return (this != null) && !this.isEmpty()
}

// Capitalizes first letter
String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

// Check if value is a number
const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n)

// Check if a value is a string
const isString = value => typeof value === 'string' || value instanceof String

const isArray = value => Array.isArray(value)

const isFunction = (functionToCheck) => {
 return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

// Checks if a number ends with a char sequence
Number.prototype.endsWith = function(s) {
  return this.toString().endsWith(s)
}

const isBlank = function (o) {
  return o === undefined || o === null
}

console.ce = function(message) {
  if ((typeof Config !== 'undefined' && Config !== null) && !Config.instance.engine.debug) {
    return
  }
  console.log(message)
}

const whichAnimationEvent = function() {
  const el = document.createElement('fakeelement')
  const animations = {
    'animation': 'animationend',
    'OAnimation': 'oAnimationEnd',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
  }
  for (let t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t]
    }
  }
}

const arrayOrStringToString = (input) => {
  if (isArray(input)) {
    return input.join('\n')
  } else if (isString(input)) {
    return input
  } else {
    throw 'invalid input'
  }
}

THREE.Object3D.prototype.setDoubleSided = function (recursive) {
  if (isBlank(recursive)) { recursive = true }

  if (recursive) {
    this.traverse((child) => {
      if (child.uuid !== this.uuid) {
        child.setDoubleSided(recursive)
      }
    })
  }
  if (isBlank(this.material)) {
    return
  }

  Array.from([].concat(this.material)).forEach((material) => {
    material.side = THREE.DoubleSide
  })
}

THREE.Object3D.prototype.setOpacity = function (amount, recursive) {
  if (isBlank(recursive)) { recursive = true }

  if (recursive) {
    this.traverse((child) => {
      if (child.uuid !== this.uuid) {
        child.setOpacity(amount, recursive)
      }
    })
  }
  if (isBlank(this.material)) {
    return
  }

  Array.from([].concat(this.material)).forEach((material) => {
    material.transparent = true
    material.opacity = amount
  })
}

// TODO: use traverse
THREE.Object3D.prototype.setWireframe = function (value, recursive) {
  if (recursive === null || recursive === undefined) { recursive = true }

  if (recursive) {
    this.children.forEach(function (child) {
      child.setWireframe(value)
    })
  }
  Array.from([].concat(this.material)).forEach(function (material) {
    if (material !== null && material !== undefined) {
      material.wireframe = value
    }
  })
}

// TODO: use traverse
THREE.Object3D.prototype.removeAllChildren = function () {
  while (this.children.length) {
    var target = this.children[0]
    this.remove(target)
    if (target.geometry !== null && target.geometry !== undefined) {
      target.geometry.dispose()
      if (target.geometry.dispose !== undefined) {
        target.geometry.dispose()
      }
    }
    if (target.material !== null && target.material !== undefined) {
      [].concat(target.material).forEach(function (material) {
        // if (material.map !== null && material.map !== undefined) {
        // material.map.dispose()
        // }
        if (material.dispose !== undefined) {
          material.dispose()
        }
      })
    }
  }
}


THREE.Object3D.prototype.getBoneNames = function () {
  let bones = []
  this.traverse(function(object) {
    if (object instanceof THREE.Bone) {
      bones.push(object.name)
    }
  });
  return bones
}

// attach a mesh to a bone
//
// @param [String] boneName
// @param [Mesh] mesh
// @param [int] scale - defaults to one
//
// between 71 and 72, for some reason there is always another bone
// with the same name. That is why we keep track of added,
// so we don't add it twice
THREE.Object3D.prototype.attachToBone = function (boneName, mesh, scale) {
  if (isBlank(scale)) { scale = 1 }
  if (isBlank(mesh)) { throw 'mesh to attach is blank' }
  let added = false;
  this.traverse(function(object) {
    if (added) { return; }
    if (object instanceof THREE.Bone && (object.name === boneName)) {
      added = true;
      mesh.scale.set(scale, scale, scale)
      return object.add(mesh);
    }
  });
  if (!added) { console.warn('mesh not added to bone ${boneName}') }
  return added
}

// detach a mesh from a bone
//
// @param [String] boneName
// @param [Mesh] mesh
THREE.Object3D.prototype.detachFromBone = function (boneName, mesh) {
  // if (this instanceof THREE.SkinnedMesh) {
  return this.traverse(function(object) {
    if (object instanceof THREE.Bone && (object.name === boneName)) {
      return object.remove(mesh);
    }
  });
}

setSkinHelper = function (material, key) {
  if (isArray(material)) {
    material[0].map = AssetManager.get(key)
    material[0].needsUpdate = true
  } else {
    material.map = AssetManager.get(key)
    material.needsUpdate = true
  }
}

THREE.Object3D.prototype.setSkin = function (key) {
  if (!AssetManager.has(key)) {
    throw 'key ' + key + ' not found'
  }
  if (!isBlank(this.material)) {
    setSkinHelper(this.material, key)
  } else {
    this.traverse(function (obj) {
      if (obj instanceof THREE.SkinnedMesh) {
        setSkinHelper(obj.material, key)
      }
    })
  }
}

THREE.Object3D.prototype.shadowCast = function () {
  this.traverse(function (obj) {
    obj.castShadow = true
  })
}

THREE.Object3D.prototype.shadowReceive = function () {
  this.traverse(function (obj) {
    obj.receiveShadow = true
  })
}

THREE.Object3D.prototype.shadowCastAndReceive = function () {
  this.traverse(function (obj) {
    obj.castShadow = true
    obj.receiveShadow = true
  })
}

THREE.Object3D.prototype.shadowCastAndNotReceive = function () {
  this.traverse(function (obj) {
    obj.castShadow = true
    obj.receiveShadow = false
  })
}

THREE.Object3D.prototype.shadowNone = function () {
  this.traverse(function (obj) {
    obj.castShadow = false
    obj.receiveShadow = false
  })
}

class Singleton {}
