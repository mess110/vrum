const stopPropagation = (event) => {
  let stopIt = (event) => { event.stopPropagation() }
  document.querySelectorAll('input[type=text]').forEach((e) => {
    e.addEventListener('keydown', stopIt)
  })
}

const loadModel = (url) => {
  let inputUrl = document.querySelector('#inputUrl')
  let scale = parseFloat(document.querySelector('#scale').value)
  if (!isBlank(url)) {
    inputUrl.value = url
  }
  Hodler.get('mainScene').loadModel(inputUrl.value, scale)
  const lastModels = Persist.getJson('lastModels')
  if (!lastModels.includes(inputUrl.value)) {
    lastModels.insert(0, inputUrl.value)
    while (lastModels.size() > 8) {
      lastModels.pop()
    }
    Persist.setJson('lastModels', lastModels)
    updateLastModels()
  }
}

const updateLastModels = () => {
  const lastModels = Persist.getJson('lastModels')
  const element = document.querySelector('#lastModels')
  element.innerHTML = ''

  lastModels.forEach((e) => {
    const button = document.createElement('span')
    button.className = 'button'
    button.setAttribute('onclick', `loadModel('${e}')`)
    button.innerHTML = AssetManager.getAssetKey({ path: e })
    element.append(button)
  })
}

let wireframe = false
const toggleWireframe = () => {
  wireframe = !wireframe
  Utils.setWireframe(wireframe)
}

const toggleGird = () => {
  let grid = Hodler.get('scene').grid
  grid.visible = !grid.visible
}

const toggleSky = () => {
  let sky = Hodler.get('scene').sky
  sky.visible = !sky.visible
}
