/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Used to overlay stuff on a canvas. The canvas can be later used to create
// a material.
//
// @see Helper.materialFromCanvas
//
// @example
//   @drawImage(key: 'corb')
//   @drawImage(key: 'template')
//
//   @drawText(text: 'foo', y: 60, strokeStyle: 'black')
//   @drawBezier(
//     curve: '99.2,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
//     text: 'hello world'
//     strokeStyle: 'black'
//     letterPadding: 4
//   )
class ArtGenerator {
  // @nodoc
  constructor(options) {
    this.options = options;

    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = options.width;
    this.canvas.height = options.height;
    this.ctx = this.canvas.getContext( '2d' );
  }

  // @example
  //   @art = new ArtGenerator(
  //     width: 340
  //     height: 473
  //   )
  //   @art.fromJson items: [
  //     {
  //       type: 'image'
  //       key: 'corb'
  //     }
  //     {
  //       type: 'image'
  //       key: 'template'
  //     }
  //     {
  //       type: 'text'
  //       text: 'foo'
  //       y: 60
  //       strokeStyle: 'black'
  //     }
  //     {
  //       type: 'bezier'
  //       curve: '99.2,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
  //       text: 'hello world'
  //       strokeStyle: 'black'
  //       letterPadding: 4
  //     }
  //   ]
  fromJson(json) {
    this.clear();
    return (() => {
      const result = [];
      for (let item of Array.from(json.items)) {
        if ((item.asset != null) && (item.asset.key != null)) {
          item.key = item.asset.key;
        }
        if (item.type === 'image') {
          this.drawImage(item);
        }
        if (item.type === 'text') {
          this.drawText(item);
        }
        if (item.type === 'bezier') {
          result.push(this.drawBezier(item));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  // Used to overlay a bezier curve on a canvas
  //
  // @see StackOverflow.drawBezier
  // @see draw bezier tool
  //
  // @example
  //   @drawBezier(
  //     curve: '99.2,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
  //     text: 'hello world'
  //     strokeStyle: 'black'
  //     letterPadding: 4
  //   )
  drawBezier(options) {
    return StackOverflow.drawBezier(options, this.ctx);
  }

  // Overlay text on a canvas
  //
  // @example
  //   @drawText(text: 'foo', y: 60, strokeStyle: 'black')
  drawText(options) {
    if (options == null) { options = {}; }
    if (options.text == null) { throw 'options.text missing'; }
    if (options.fillStyle == null) { options.fillStyle = 'white'; }
    if (options.fillLineWidth == null) { options.fillLineWidth = 1; }
    if (options.strokeLineWidth == null) { options.strokeLineWidth = 7; }
    if (options.strokeStyle == null) { options.strokeStyle = undefined; } // lol
    if (options.font == null) { options.font = '40px Helvetica'; }
    if (options.x == null) { options.x = 0; }
    if (options.y == null) { options.y = 0; }
    if (options.angle == null) { options.angle = 0; }

    this.ctx.save();
    this.ctx.font = options.font;

    if (options.angle !== 0) {
      this.ctx.rotate((options.angle * Math.PI) / 180);
    }

    if (options.strokeStyle != null) {
      this.ctx.miterLimit = 2;
      this.ctx.lineJoin = 'circle';
      this.ctx.strokeStyle = options.strokeStyle;
      this.ctx.lineWidth = options.strokeLineWidth;
      this.ctx.strokeText(options.text, options.x, options.y);
    }

    this.ctx.lineWidth = options.fillLineWidth;
    this.ctx.fillStyle = options.fillStyle;
    this.ctx.fillText(options.text, options.x, options.y);
    return this.ctx.restore();
  }

  // Used to overlay an image on the canvas
  //
  // @example
  //   @drawImage(key: 'corb')
  //   @drawImage(key: 'template')
  //
  drawImage(options) {
    if (isBlank(options)) { options = {}; }
    if (isBlank(options.key)) { throw 'key not found'; }
    if (isBlank(options.x)) { options.x = 0; }
    if (isBlank(options.y)) { options.y = 0; }
    if (isBlank(options.angle)) { options.angle = 0; }

    let { x } = options;
    let { y } = options;

    let texture = AssetManager.get(options.key);
    if (isBlank(texture)) {
      throw `texture '${options.key}' not loaded`
    }
    const { image } = texture

    if (options.angle !== 0) {
      this.ctx.save();
      this.ctx.translate(options.x + (image.width / 2), options.y + (image.height / 2));
      this.ctx.rotate((options.angle * Math.PI) / 180);
      x = -(image.width / 2);
      y = -(image.height / 2);
    }

    this.ctx.drawImage(image, x, y);

    if (options.angle !== 0) {
      return this.ctx.restore();
    }
  }

  // clear the canvas context
  clear() {
    return this.ctx.clearRect(0, 0, this.options.width, this.options.height);
  }
}
