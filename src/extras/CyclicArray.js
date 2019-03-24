// Used for next() and prev()
//
// a = [1, 2, 3]
// ca = a.toCyclicArray()
// ca.next()
//
class CyclicArray {
  constructor(items) {
    if (isBlank(items)) { items = [] }
    this.items = items
    this.index = 0
  }

  get() {
    return this.items[this.index]
  }

  next() {
    this.index += 1
    if (this.index > (this.items.size() - 1)) { this.index = 0 }
    return this.get()
  }

  prev() {
    this.index -= 1
    if (this.index < 0) { this.index = this.items.size() - 1 }
    return this.get()
  }

  size() {
    return this.items.size()
  }
}

