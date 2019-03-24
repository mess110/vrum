class GameScene extends Scene {
  init(options) {
    Hodler.get('engine').renderManager.setWidthHeight({ width: window.innerWidth / 2, height: window.innerHeight})

    let camera = this.getCamera()
    camera.position.set(0, 0, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    let sky = new Sky()
    this.add(sky)

    this.json = AssetManager.get('majestic-frog-cover.json')
    this.art = Utils.graffiti(this.json)
    this.add(this.art)

    Utils.toggleOrbitControls()

    this.add(new THREE.AmbientLight())

    this.tryInitEditor()
  }

  setJSON(key) {
    let json = AssetManager.get(key)
    this.editor.setValue(JSON.stringify(json, null, 2))
    this.editor.clearSelection()
    document.querySelector('#panel-text').textContent = key
  }

  tryInitEditor() {
    let scene = Hodler.get('scene')
    if (typeof(ace) !== "undefined") {
      scene.editor = ace.edit('editor');
      scene.editor.getSession().setMode('ace/mode/json');
      scene.editor.setTheme('ace/theme/monokai');
      scene.setJSON('majestic-frog-cover.json')
      document.querySelectorAll('.panel').forEach((e) => {
        e.style.display = 'flex'
      })
      stopPropagation()
    } else {
      scene.setTimeout(scene.tryInitEditor, 10)
    }
  }

  tick(tpf) {
  }

  doMouseEvent(event, raycaster) {
    // console.log(`${event.type} ${event.which} ${event.x}:${event.y} ${event.wheelDelta}`)
  }

  doKeyboardEvent(event) {
  // console.log(`${event.type} ${event.code} (${event.which})`)
  }
}

Config.instance.engine.debug = true
Config.instance.window.resize = false

const stopPropagation = (event) => {
  let stopIt = (event) => { event.stopPropagation() }
  document.querySelectorAll('#editor').forEach((e) => {
    e.addEventListener('keydown', stopIt)
  })
}

const save = () => {
  console.log('save')
  let editor = Hodler.get('scene').editor
  let s = editor.getValue()
  Utils.saveFile(JSON.parse(s), 'object.json')
}

const load = () => {
  let basePath = '/workspace/assets/'
  let assetFolderAndName = prompt(`Load asset from ${basePath}`);
  console.log('load')
}

Engine.start(new GameScene(), [
  { type: 'font', path: '/workspace/assets/fonts/luckiest-guy' },
  { type: 'json', path: '/workspace/assets/graffiti/majestic-frog-cover.json' },
  { type: 'image', path: '/workspace/assets/textures/vrum.png' },
  { type: 'image', path: '/workspace/assets/textures/black-faded-border.png' },
])
