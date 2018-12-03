function toggleSlider() {
  var isOpen = slider.classList.contains('slide-in');
  slider.setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
}

function toggleFade() {
  document.querySelector('#icon').classList.toggle("animate-flicker");
}

function setColor(color) {
  document.querySelector('#icon-path').style.fill = color
}

function toggleVisibility() {
  document.querySelector('#icon').classList.toggle('invisible')
}

function actionButton() {
  hasUsername = !isBlank(Persist.get('username'))
  if (!hasUsername) {
    toggleSlider()
    return
  }

  if (hasUsername && isBlank(room)) {
    window.location.href = `zxing://scan/?ret=${window.location.href}?room={CODE}`
    return
  }

  Hodler.get('scene').connect()
}

class ControllerScene extends Scene {
  init(options) {
    this.add(new THREE.AmbientLight(0xffffff))
    this.isPressed = false
    this.isConnected = false

    // if (!isBlank(Persist.get('username')) && !isBlank(room)) {
      // this.connect()
    // }
  }

  connect() {
    if (this.isConnected) { return }
    this.isConnected = true
    let mn = MeshNetwork.instance
    mn.connect('https://mesh.opinie-publica.ro', room, {
      cCallback: function () {
        toggleVisibility()
        Hodler.get('scene').addControls()
      },
      dcCallback: function () {
        toggleVisibility()
        setColor('#FF0000')
      }
    })
  }

  tick(tpf) {
  }

  addControls() {
    this.vc = new VirtualController()

    this.vc.joystick1.addEventListener('touchStart', function () {
      Hodler.get('scene').isPressed = true
    })

    this.vc.joystick1.addEventListener('touchEnd', function () {
      Hodler.get('scene').isPressed = false
    })

    this.vc.joystick2.addEventListener('touchStart', function () {
      MeshNetwork.instance.emit({ action: 'fire', isPressed: true })
    })

    this.vc.joystick2.addEventListener('touchEnd', function () {
      MeshNetwork.instance.emit({ action: 'fire', isPressed: false })
    })


    this.setInterval(function() {
      let scene = Hodler.get('scene')
      let joystick = scene.vc.joystick1

      // TODO: instead of emit, figure out who master is and send only to master
      MeshNetwork.instance.emit({
        action: 'stick',
        dX: joystick.deltaX(),
        dY: joystick.deltaY(),
        direction: (joystick.right()? 'right': '') + (joystick.up()? 'up': '') + (joystick.down()? 'down': '') + (joystick.left()? 'left': ''),
        isPressed: scene.isPressed
      })
    }, 1/30 * 1000);
  }

  doMouseEvent(event, raycaster) {
    if (event.type == 'mousedown') {
      var isOpen = slider.classList.contains('slide-in');
      if (isOpen) { toggleSlider() }
    }
  }
}

document.querySelector('#input').addEventListener('input', function (evt) {
  Persist.set('username', this.value)
});

Utils.orientation('landscape')
let connected = false
let slider = document.getElementById('slider');
let room = MeshNetwork.getRoomId()
let controllerScene = new ControllerScene()
Engine.start(controllerScene)
