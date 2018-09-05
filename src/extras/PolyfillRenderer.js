// Used as a dummy renderer if WebGL is not supported.
//
// Override the makeDomElement method to change the HTML of the object show on screen.
// The object has the id coffee-engine-dom so you can modify it from CSS.
class PolyfillRenderer extends THREE.WebGLRenderer {
  constructor(parameters) {
    super(parameters)
    this.domElement = PolyfillRenderer.makeDomElement()
  }

  render(scene, camera) {}

  static makeDomElement() {
    const element = document.createElement('div')
    element.style.display = 'flex'
    element.style.position = 'absolute'
    element.style.width = '100%'
    element.style.height = '100%'
    element.style['align-items'] = 'center'
    element.style['text-align'] = 'center'
    element.style['background-color'] = 'black'
    element.style['color'] = 'white'
    // element.style['z-index'] = Utils.CE_UI_Z_INDEX * 10

    const text = document.createElement('div')
    text.style.width = '100%'
    text.innerHTML = 'WebGL not supported'
    element.append(text)

    return element
  }
}
