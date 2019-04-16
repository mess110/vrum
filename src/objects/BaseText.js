// let text = new BaseText({
//   text: 'Press <Enter> to start', fillStyle: 'blue',
//   strokeStyle: 'black', strokeLineWidth: 1,
//   canvasW: 1024, canvasH: 1024,
//   font: '64px luckiest-guy'})
// text.position.set(0, 0, 4)
class BaseText extends THREE.Mesh {
  constructor(options) {
    if (isBlank(options)) { options = {}; }
    var canvasW = options.canvasW || 512;
    var canvasH = options.canvasH || 512;

    var w = options.w || 4;
    var h = options.h || 4;

    if (!([THREE.MeshBasicMaterial, THREE.MeshLambertMaterial].includes(options.material))) {
      options.material = THREE.MeshBasicMaterial
    }

    var margin = options.margin;
    var lineHeight = options.lineHeight;
    var align = options.align;
    var font = options.font || '16px Helvetica';
    var fillStyle = options.fillStyle;
    var fillLineWidth = options.fillLineWidth;
    var strokeStyle = options.strokeStyle;
    var strokeLineWidth = options.strokeLineWidth;
    var text = options.text;
    var x = options.x;
    var y = options.y;

    var dynamicTexture = new THREEx.DynamicTexture(canvasW, canvasH)

    const geom = new THREE.PlaneGeometry(w, h);
    const material  = new options.material({
      map: dynamicTexture.texture,
      transparent: true
    });

    super(geom, material)

    this.dynamicTexture = dynamicTexture
    this.margin = margin
    this.lineHeight = lineHeight
    this.align = align
    this.fillStyle = fillStyle
    this.fillLineWidth = fillLineWidth
    this.strokeStyle = strokeStyle
    this.strokeLineWidth = strokeLineWidth
    this.x = x
    this.y = y
    this.font = font
    this.setText(text)
  }

  setText(text) {
    if ((text === '') || (text == null)) { text = ' '; }

    this.text = text.toString();
    this.clear();
    return this.dynamicTexture.drawTextCooked({
      text: this.text,
      margin: this.margin,
      lineHeight: this.lineHeight,
      align: this.align,
      fillStyle: this.fillStyle,
      fillLineWidth: this.fillLineWidth,
      strokeStyle: this.strokeStyle,
      strokeLineWidth: this.strokeLineWidth,
      x: this.x,
      y: this.y,
      font: this.font
    });
  }

  appendText(text) {
    this.setText(`${this.text}${text}`)
  }

  clear() {
    this.dynamicTexture.clear();
  }

  getTextWidth(s) {
    return this.dynamicTexture.context.measureText(s).width;
  }
}
