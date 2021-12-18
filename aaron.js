'use strict';

const canvas = document.getElementsByTagName('canvas')[0];
resizeCanvas();

let config = {
  PAUSED: false,
}

const gl = canvas.getContext('webgl2');

startGUI();

let lastUpdateTime = Date.now();
update();

function step () {
};

function render () {
}

function update () {
    const dt = calcDeltaTime();
    if (!config.PAUSED) step(dt);
    render();
    requestAnimationFrame(update);
}

function calcDeltaTime () {
  let now = Date.now();
  let dt = (now - lastUpdateTime) / 1000;
  dt = Math.min(dt, 0.016666);
  lastUpdateTime = now;
  return dt;
}


function resizeCanvas () {
  let width = scaleByPixelRatio(canvas.clientWidth);
  let height = scaleByPixelRatio(canvas.clientHeight);
  if (canvas.width != width || canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
      return true;
  }
  return false;
}

function scaleByPixelRatio (input) {
  let pixelRatio = window.devicePixelRatio || 1;
  return Math.floor(input * pixelRatio);
}

function startGUI () {
  var gui = new dat.GUI({ width: 300 });
  gui.add(config, 'PAUSED').name('paused').listen();
}