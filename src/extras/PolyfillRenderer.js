// Displays a message if WebGL is not supported.
//
// To help customize the message there are 2 relevant ids:
//
//  * vrum-webgl-warning-container
//  * vrum-webgl-warning-text
//
// For more detailed customizations, you can override
//
//  * makeDomElement
//  * makeContainerElement
//
class PolyfillRenderer extends THREE.WebGLRenderer {
  constructor(parameters) {
    super(parameters)
    this.domElement = PolyfillRenderer.makeDomElement()
  }

  render(scene, camera) {}

  static makeContainerElement() {
    const element = document.createElement('div')
    element.setAttribute('id', 'vrum-webgl-warning-container')
    element.style.display = 'flex'
    element.style.position = 'absolute'
    element.style.width = '100%'
    element.style.height = '100%'
    element.style['align-items'] = 'center'
    element.style['text-align'] = 'center'
    element.style['background-color'] = 'black'
    element.style['color'] = 'white'
    element.style['z-index'] = Config.instance.ui.zIndex.noWebGL
    return element;
  }

  static makeDomElement() {
    let element = this.makeContainerElement()

    const text = document.createElement('div')
    text.setAttribute('id', 'vrum-webgl-warning-text')
    text.style.width = '100%'
    text.innerHTML = 'WebGL not supported'
    element.append(text)

    return element
  }
}
