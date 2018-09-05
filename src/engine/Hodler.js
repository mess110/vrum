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

  static add(key, value) {
    Hodler.instance.add(key, value)
  }

  static get(key) {
    return Hodler.instance.get(key)
  }
}

Hodler.instance = new Hodler()
