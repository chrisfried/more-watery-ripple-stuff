// Code mostly stolen from https://www.thanassis.space/wavePhysics.html

var width = 450;
var height = 450;

var timer = -1;
var drawTimer = -1;

var dc = null;
var canvas = null;

var lineOffset;
var prevLineOffset;
var nextLineOffset;
var image;
var val;

var red = {};
var green = {};
var blue = {};
var alpha = {};

red.offset = 0;
green.offset = 1;
blue.offset = 2;
alpha.offset = 3;

red.active = 0;
green.active = 0;
blue.active = 0;
alpha.active = 0;

red.buffers = [new Float32Array(width * height), new Float32Array(width * height)];
green.buffers = [new Float32Array(width * height), new Float32Array(width * height)];
blue.buffers = [new Float32Array(width * height), new Float32Array(width * height)];
alpha.buffers = [new Float32Array(width * height), new Float32Array(width * height)];

var offsetLookup = new Int32Array(height);
for (var i = 0; i < height; i++) {
  offsetLookup[i] = width * i;
}

function setupCanvasAndStartSimulation() {
  canvas = document.getElementById("2dwaveDC");
  dc = canvas.getContext("2d");
  image = dc.getImageData(0, 0, width, height);
  if (timer === -1) {
    timer = setInterval(function () {
      simulate(alpha);
      // simulate(red);
      simulate(green);
      simulate(blue);
    }, 52);
  }
  if (drawTimer === -1) {
  	timer = setInterval(function () {
    	draw();
    }, 13);
  }
  return true;
}

function draw() {
  dc.putImageData(image, 0, 0);
}

function simulate(buffer) {
  var wave = buffer.buffers[buffer.active];
  buffer.active = 1 - buffer.active;
  var oldWave = buffer.buffers[buffer.active];
  for (var i = 1; i < height - 1; i++) {
    lineOffset = offsetLookup[i];
    prevLineOffset = offsetLookup[i - 1];
    nextLineOffset = offsetLookup[i + 1];
    for (var j = 1; j < width - 1; j++) {
      val = null;
      val = (
        (oldWave[prevLineOffset + j - 1] +
          oldWave[prevLineOffset + j + 1] +
          oldWave[nextLineOffset + j - 1] +
          oldWave[nextLineOffset + j + 1]) / 4 - oldWave[lineOffset + j] +

        oldWave[lineOffset + j - 1] +
        oldWave[lineOffset + j + 1] +
        oldWave[nextLineOffset + j] +
        oldWave[prevLineOffset + j]
      ) / 3 - wave[lineOffset + j];
      if (Math.random() < 0.00001) {
        val = Math.random();
      }
      wave[lineOffset + j] = val * .999;

      val = Math.max(val, -1);
      val = Math.min(val, 1);
      val = (val + 1) / 2;
      var color = (255 * val);
      if (color > 255) color = 255;
      image.data[4 * (lineOffset + j) + buffer.offset] = color;
    }
  }
}

(function () {
  setupCanvasAndStartSimulation();
})();
