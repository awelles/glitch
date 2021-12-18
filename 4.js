'use strict';

window.onload = main;

const canvas = document.getElementsByTagName('canvas')[ 0 ];
const gl = canvas.getContext('webgl');

function main () {
  console.log('main');

  let program = createProgramFromScripts(gl, 'vertex-shader-2d', 'fragment-shader-2d');

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // look up uniform locations
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var colorUniformLocation = gl.getUniformLocation(program, "u_color");


  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // set the resolution

  gl.enableVertexAttribArray(positionAttributeLocation);
  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  for (var ii = 0; ii < 50; ++ii) {
    // Setup a random rectangle
    // This will write to positionBuffer because
    // its the last thing we bound on the ARRAY_BUFFER
    // bind point
    setRectangle(
        gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

    // Set a random color.
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
    var offsetLoc = gl.getUniformLocation(program, "u_offset");
    gl.uniform4fv(offsetLoc, [ 1, 0, 0, 0 ]);
    
    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }

}

function resizeCanvasToDisplaySize (canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  const needResize = canvas.width !== displayWidth ||
    canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

function createShader (gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram (gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}


function createProgramFromScripts (gl, vertexShaderId, fragmentShaderId) {
  var vertexShaderSource = document.querySelector(`#${ vertexShaderId }`).text;
  var fragmentShaderSource = document.querySelector(`#${ fragmentShaderId }`).text;
  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  // let program = createProgram(gl, vertexShader, fragmentShader);
  return createProgram(gl, vertexShader, fragmentShader);
}

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}