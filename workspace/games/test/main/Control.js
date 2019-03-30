class Control {
  constructor(target) {
    this.target = target
    let actions = {}
    this.actions = actions
  }

  doKeyboardEvent(event) {
    this.keybindings = {
      'Forward': 'KeyW',
      'Backward': 'KeyS',
      'Left': 'KeyA',
      'Right': 'KeyD',
      'RotateLeft': 'ArrowLeft',
      'RotateRight': 'ArrowRight'
    }

    console.log(event.code)
    if (!['KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(event.code)) { return }
    this.actions[event.code] = event.type == "keydown"
    console.log(this.actions)
  }
}
