/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
var StackOverflow = StackOverflow || {};

// http://stackoverflow.com/a/31349123/642778
// did some cleanup and customization of the fonts
StackOverflow.drawBezier = function(options, ctx) {
  if (options == null) { options = {}; }
  options = Utils.shallowClone(options);
  if (options.curve != null) {
    if (options.points == null) { options.points = options.curve.split(','); }
  }

  if (options.text == null) { options.text = 'Text'; }
  if (options.letterPadding == null) { options.letterPadding = 1 / 4; }
  if (options.fillStyle == null) { options.fillStyle = 'white'; }
  if (options.fillLineWidth == null) { options.fillLineWidth = 1; }
  if (options.strokeLineWidth == null) { options.strokeLineWidth = 10; }
  if (options.strokeStyle == null) { options.strokeStyle = undefined; } // lol
  if (options.font == null) { options.font = '40px Helvetica'; }
  if (options.points == null) { options.points = []; }
  if (options.drawText == null) { options.drawText = true; }
  if (options.drawCurve == null) { options.drawCurve = false; }
  if (options.maxChar == null) { options.maxChar = 50; }
  if (options.x == null) { options.x = 0; }
  if (options.y == null) { options.y = 0; }

  if (options.points.length !== 8) { throw 'needs 8 points'; }

  options.points = options.points.map(item => parseFloat(item));

  let i = 0;
  for (let point of Array.from(options.points)) {
    if ((i % 2) === 0) {
      options.points[i] += options.x;
    } else {
      options.points[i] += options.y;
    }
    i += 1;
  }

  const ribbonSpecs = {
    maxChar: options.maxChar,
    startX: options.points[0],
    startY: options.points[1],
    control1X: options.points[2],
    control1Y: options.points[3],
    control2X: options.points[4],
    control2Y: options.points[5],
    endX: options.points[6],
    endY: options.points[7]
  };
  // ctx.clearRect 0, 0, canvas.width, canvas.height

  if (options.drawCurve) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ribbonSpecs.startX, ribbonSpecs.startY);
    ctx.bezierCurveTo(ribbonSpecs.control1X, ribbonSpecs.control1Y, ribbonSpecs.control2X, ribbonSpecs.control2Y, ribbonSpecs.endX, ribbonSpecs.endY);
    ctx.stroke();
    ctx.restore();
  }

  if (!options.drawText) { return; }

  const textCurve = [];
  const ribbon = options.text.substring(0, ribbonSpecs.maxChar);
  const curveSample = 1000;
  const xDist = 0;
  i = 0;
  i = 0;
  while (i < curveSample) {
    const a = new bezier2(i / curveSample, ribbonSpecs.startX, ribbonSpecs.startY, ribbonSpecs.control1X, ribbonSpecs.control1Y, ribbonSpecs.control2X, ribbonSpecs.control2Y, ribbonSpecs.endX, ribbonSpecs.endY);
    const b = new bezier2((i + 1) / curveSample, ribbonSpecs.startX, ribbonSpecs.startY, ribbonSpecs.control1X, ribbonSpecs.control1Y, ribbonSpecs.control2X, ribbonSpecs.control2Y, ribbonSpecs.endX, ribbonSpecs.endY);
    const c = new bezier(a, b);
    textCurve.push({
      bezier: a,
      curve: c.curve
    });
    i++;
  }
  const letterPadding = ctx.measureText(' ').width * options.letterPadding;
  const w = ribbon.length;
  const ww = Math.round(ctx.measureText(ribbon).width);
  const totalPadding = (w - 1) * letterPadding;
  const totalLength = ww + totalPadding;
  let p = 0;
  const { cDist } = textCurve[curveSample - 1].curve;
  const z = (cDist / 2) - (totalLength / 2);
  i = 0;
  while (i < curveSample) {
    if (textCurve[i].curve.cDist >= z) {
      p = i;
      break;
    }
    i++;
  }
  i = 0;
  while (i < w) {
    ctx.save();
    ctx.translate(textCurve[p].bezier.point.x, textCurve[p].bezier.point.y);
    ctx.rotate(textCurve[p].curve.rad);

    ctx.font = options.font;
    if (options.strokeStyle != null) {
      ctx.strokeStyle = options.strokeStyle;
      ctx.lineWidth = options.strokeLineWidth;
      ctx.strokeText(ribbon[i], 0, 0);
    }
    ctx.fillStyle = options.fillStyle;
    ctx.lineWidth = options.fillLineWidth;
    ctx.fillText(ribbon[i], 0, 0);

    ctx.restore();
    const x1 = ctx.measureText(ribbon[i]).width + letterPadding;
    let x2 = 0;
    let j = p;
    while (j < curveSample) {
      x2 = x2 + textCurve[j].curve.dist;
      if (x2 >= x1) {
        p = j;
        break;
      }
      j++;
    }
    i++;
  }
};

var bezier = function(b1, b2) {
  //Final stage which takes p, p+1 and calculates the rotation, distance on the path and accumulates the total distance
  this.rad = Math.atan(b1.point.mY / b1.point.mX);
  this.b2 = b2;
  this.b1 = b1;
  const dx = b2.x - (b1.x);
  const dx2 = (b2.x - (b1.x)) * (b2.x - (b1.x));
  this.dist = Math.sqrt(((b2.x - (b1.x)) * (b2.x - (b1.x))) + ((b2.y - (b1.y)) * (b2.y - (b1.y))));
  var xDist = xDist + this.dist;
  this.curve = {
    rad: this.rad,
    dist: this.dist,
    cDist: xDist
  };
};

const bezierT = function(t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY) {
  //calculates the tangent line to a point in the curve; later used to calculate the degrees of rotation at this point.
  this.mx = (3 * (1 - t) * (1 - t) * (control1X - startX)) + (6 * (1 - t) * t * (control2X - control1X)) + (3 * t * t * (endX - control2X));
  this.my = (3 * (1 - t) * (1 - t) * (control1Y - startY)) + (6 * (1 - t) * t * (control2Y - control1Y)) + (3 * t * t * (endY - control2Y));
};

var bezier2 = function(t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY) {
  //Quadratic bezier curve plotter
  this.Bezier1 = new bezier1(t, startX, startY, control1X, control1Y, control2X, control2Y);
  this.Bezier2 = new bezier1(t, control1X, control1Y, control2X, control2Y, endX, endY);
  this.x = ((1 - t) * this.Bezier1.x) + (t * this.Bezier2.x);
  this.y = ((1 - t) * this.Bezier1.y) + (t * this.Bezier2.y);
  this.slope = new bezierT(t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY);
  this.point = {
    t,
    x: this.x,
    y: this.y,
    mX: this.slope.mx,
    mY: this.slope.my
  };
};

var bezier1 = function(t, startX, startY, control1X, control1Y, control2X, control2Y) {
  //linear bezier curve plotter; used recursivly in the quadratic bezier curve calculation
  this.x = ((1 - t) * (1 - t) * startX) + (2 * (1 - t) * t * control1X) + (t * t * control2X);
  this.y = ((1 - t) * (1 - t) * startY) + (2 * (1 - t) * t * control1Y) + (t * t * control2Y);
};
