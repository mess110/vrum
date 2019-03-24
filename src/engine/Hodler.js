class Hodler {
  constructor() {
    this.data = {}
  }

  add(key, value) {
    this.data[key] = value
  }

  get(key) {
    return this.data[key]
  }

  has(key) {
    return !isBlank(this.get(key))
  }

  static add(key, value) {
    Hodler.instance.add(key, value)
  }

  static get(key) {
    return Hodler.instance.get(key)
  }

  static has(key) {
    return Hodler.instance.has(key)
  }
}

Hodler.instance = new Hodler()
