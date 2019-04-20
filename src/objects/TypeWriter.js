class TypeWriter extends THREE.Object3D {
  constructor(options) {
    super()

    if (isBlank(options)) { options = {} }
    if (isBlank(options.minLength)) {
      options.minLength = 1
    }
    if (!isFunction(options.backCallback)) {
      options.backCallback = () => {
        console.warn('nothing happens when back is pressed')
      }
    }
    if (!isFunction(options.enterCallback)) {
      options.enterCallback = () => {
        console.warn('nothing happens when enter is pressed')
      }
    }

    this.uptime = 0
    this.lastGamepadEventTime = 0
    this.buttonWidth = 1.9
    this.buttons = []

    let textInput = new MenuButton('_')
    textInput.position.set(0, this.buttonWidth * 1.5, 0)
    this.add(textInput)
    this.textInput = textInput

    let lines = [
      '1234567890',
      'qwertyuiop',
      'asdfghjkl-',
      'zxcvbnm,./'
    ]
    let lineArray = lines.map((e) => { return e.split('') })
    lineArray.push(['back', 'back', ' ', ' ', ' ', '<-', '<-', '<-', 'ok', 'ok'])
    this.lineArray = lineArray

    lines.forEach((line, index) => {
      this.addLetterRow(line, index * -this.buttonWidth)
    })

    let backButton = new LongLetterButton('back')
    backButton.onClick = () => {
      backButton.isEnabled = false
      options.backCallback()
    }
    backButton.position.set(-this.buttonWidth * 4, -this.buttonWidth * 4, 0)
    this.add(backButton)
    this.buttons.push(backButton)

    let spaceButton = new LongLetterButton(' ')
    spaceButton.onClick = () => {
      this.addLetter(' ')
    }
    spaceButton.position.set(-3, -this.buttonWidth * 4, 0)
    this.add(spaceButton)
    this.buttons.push(spaceButton)

    let backspaceButton = new LongLetterButton('<-')
    backspaceButton.onClick = () => {
      this.backspace()
    }
    backspaceButton.position.set(3, -this.buttonWidth * 4, 0)
    this.add(backspaceButton)
    this.buttons.push(backspaceButton)

    let enterButton = new LongLetterButton('ok')
    enterButton.onClick = () => {
      if (this.getText().size() >= options.minLength) {
        enterButton.isEnabled = false
        options.enterCallback()
      }
    }
    enterButton.position.set(this.buttonWidth * 4, -this.buttonWidth * 4, 0)
    this.add(enterButton)
    this.buttons.push(enterButton)

  }

  addLetterRow(letters, y) {
    letters.split('').forEach((letter, index) => {
      let letterButton = new LetterButton(letter)
      letterButton.onClick = () => {
        this.addLetter(letter)
      }
      letterButton.position.set((-this.buttonWidth * 10 / 2 + this.buttonWidth / 2) + index * this.buttonWidth, y, 0)
      this.add(letterButton)
      this.buttons.push(letterButton)
    })
  }

  getText() {
    return this.textInput.text.text.slice(0, -1)
  }

  addLetter(letter) {
    let txt = this.getText()
    txt += letter
    txt = txt.substring(0, 10);
    this.textInput.setText(`${txt}_`)
  }

  backspace() {
    let txt = this.getText().slice(0, -1)
    this.textInput.setText(`${txt}_`)
  }

  tick(tpf) {
    this.uptime += tpf
    this.buttons.forEach((button) => {
      button.tick(tpf)
    })
  }

  doMouseEvent(event, raycaster) {
    this.buttons.forEach((button) => {
      button.doMouseEvent(event, raycaster)
    })
  }

  findButtonByText(s) {
    let found
    this.buttons.forEach((button) => {
      if (button.text.text === s) {
        found = button
      }
    })
    return found
  }

  doKeyboardEvent(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
      if (event.type !== 'keydown') { return }

      let hovered
      let hasHover = false
      this.buttons.forEach((button) => {
        if (button.isHovered) {
          hovered = button
        }
        hasHover = hasHover || button.isHovered
        button.isHovered = false
      })

      if (hasHover) {
        let cht = hovered.text.text
        let i
        this.lineArray.forEach((line, index) => {
          if (line.includes(cht)) { i = index }
        })
        let j = this.lineArray[i].indexOf(cht)

        let newI = i
        if (event.code === 'ArrowUp') {
          newI -= 1
          if (newI < 0) {
            newI = this.lineArray.size() - 1
          }
        }
        if (event.code === 'ArrowDown') {
          newI += 1
          if (newI > this.lineArray.size() - 1) {
            newI = 0
          }
        }

        let newJ = j
        if (event.code === 'ArrowLeft') {
          newJ -= 1
          if (newJ < 0) {
            newJ = this.lineArray[i].size() - 1
          }
        }
        if (event.code === 'ArrowRight') {
          let needsSearch = true
          let sanity = 0
          while (needsSearch) {
            sanity += 1
            newJ += 1
            if (newJ > this.lineArray[i].size() - 1) {
              newJ = 0
            }
            needsSearch = hovered.text.text === this.lineArray[newI][newJ]
            if (sanity > this.lineArray[newI].size()) {
              needsSearch = false
            }
          }
        }
        let target = this.findButtonByText(this.lineArray[newI][newJ])
        target.isHovered = true
      } else {
        this.buttons[0].isHovered = event.code === 'ArrowRight' || event.code === 'ArrowDown'
        this.buttons.last().isHovered = event.code === 'ArrowLeft' || event.code === 'ArrowUp'
      }
    } else if (event.code === 'Enter') {
      this.buttons.forEach((button) => {
        if (button.isHovered) {
          if (event.type == 'keyup') {
            button.click()
          }
          button.isPressed = event.type === 'keydown'
        }
      })
    } else {
      this.buttons.forEach((button) => {
        let letter = button.text.text
        let keycodeLetter = `Key${letter.toUpperCase()}`
        let digitLetter = `Digit${letter}`
        let mapping = {
          'Comma': ',',
          'Period': '.',
          'Minus': '-',
          'Slash': '/',
          'Space': ' ',
          'Backspace': '<-',
          'Escape': 'back'
        }
        if (keycodeLetter === event.code || digitLetter === event.code || letter === mapping[event.code]) {
          button.isPressed = event.type === 'keydown'
          if (event.type == 'keydown') {
            button.click()
          }
        }
      })
    }
  }

  doGamepadEvent(event) {
    if (event.type !== 'gamepadtick-vrum') { return }
    if (this.lastGamepadEventTime + 0.2 > this.uptime) {
      return
    }
    let gamepad = event[0]
    if (gamepad.axes[1] > 0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'ArrowDown'})
      this.lastGamepadEventTime = this.uptime
    }
    if (gamepad.axes[1] < -0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'ArrowUp'})
      this.lastGamepadEventTime = this.uptime
    }
    if (gamepad.axes[0] < -0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'ArrowLeft'})
      this.lastGamepadEventTime = this.uptime
    }
    if (gamepad.axes[0] > 0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'ArrowRight'})
      this.lastGamepadEventTime = this.uptime
    }
    // A on xbox
    if (gamepad.buttons[0].pressed) {
      this.clickedWithGamepad = true
      this.doKeyboardEvent({type: 'keydown', code: 'Enter'})
      setTimeout(() => {
        this.doKeyboardEvent({type: 'keyup', code: 'Enter'})
      }, 100)
      this.lastGamepadEventTime = this.uptime
    }
    // back button on xbox
    if (gamepad.buttons[8].pressed) {
      this.clickedWithGamepad = true
      this.doKeyboardEvent({type: 'keydown', code: 'Escape'})
      setTimeout(() => {
        this.doKeyboardEvent({type: 'keyup', code: 'Escape'})
      }, 100)
      this.lastGamepadEventTime = this.uptime
    }
    // if (gamepad.buttons.filter((e) => { return e.pressed }).any()) {
      // console.log(gamepad.buttons)
    // }
  }
}
