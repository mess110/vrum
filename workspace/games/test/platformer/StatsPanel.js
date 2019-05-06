class StatsPanel extends THREE.Object3D {
  constructor() {
    super()

    var text = new BaseText({
      text: 'hello', fillStyle: 'blue', align: 'center',
      canvasW: 1024, canvasH: 1024,
      font: '128px luckiest-guy'})
    text.position.set(0, 0, 4)
    this.add(text)

    this.position.set(5, 5, 0)
  }
}
