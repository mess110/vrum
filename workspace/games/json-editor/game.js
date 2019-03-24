class GameScene extends Scene {
  init(options) {
    Hodler.get('engine').renderManager.setWidthHeight({ width: window.innerWidth / 2, height: window.innerHeight})

    let camera = this.getCamera()
    camera.position.set(0, 0, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    let sky = new Sky()
    this.add(sky)

    this.model = undefined

    Utils.toggleOrbitControls()

    this.add(new THREE.AmbientLight())

    this.tryInitEditor()
  }

  setJSON(json) {
    if (!isBlank(this.model)) {
      this.remove(this.model)
    }

    let model = SceneLoader.jsonToModel(json)
    if (isBlank(model)) {
      console.warn('no model')
      return
    }
    this.add(model)
    this.model = model
  }

  setJSONFromKey(key) {
    let json = AssetManager.get(key)
    let s = JSON.stringify(json, null, 2)
    this.editor.setValue(s)
    this.editor.clearSelection()
    document.querySelector('#panel-text').textContent = key
  }

  onJSONChange() {
    let scene = Hodler.get('scene')
    try {
      let jsonString = scene.editor.getValue()
      let json = JSON.parse(jsonString)
      scene.setJSON(json)
    } catch (e){
      if (e instanceof SyntaxError) {
        console.error('invalid json')
        // console.error(e)
      } else {
        throw e
      }
    }
  }

  tryInitEditor() {
    let scene = Hodler.get('scene')
    if (typeof(ace) !== "undefined") {
      scene.editor = ace.edit('editor');
      scene.editor.getSession().setMode('ace/mode/json');
      scene.editor.setTheme('ace/theme/monokai');
      scene.editor.getSession().setUseWrapMode(true);
      scene.editor.session.on('change', function(delta) {
        scene.onJSONChange()
        scene.setTimeout(() => {
          scene.onJSONChange()
        }, 2000)
      });
      load('graffiti/majestic-frog-cover.json')
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
  let editor = Hodler.get('scene').editor
  let s = editor.getValue()
  let outputName = document.querySelector('#panel-text').textContent
  Utils.saveFile(JSON.parse(s), outputName)
}

const load = (assetFolderAndName) => {
  let scene = Hodler.get('scene')
  let basePath = '/workspace/assets/'
  if (isBlank(assetFolderAndName)) {
    assetFolderAndName = prompt(`Load asset from ${basePath}`);
  }
  Utils.loadDependencies(basePath, assetFolderAndName, (asset) => {
    let key = AssetManager.getAssetKey(asset)
    scene.setJSONFromKey(key)
  }, (asset) => {
  })
}

Engine.start(new GameScene(), [
  { type: 'font', path: '/workspace/assets/fonts/luckiest-guy' },
])
