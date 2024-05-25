"use strict";
// variables for mouse rotation
var rotationMatrix;
var rotationMatrixLoc;
var angle = 0.0;
var axis = vec3(0, 0, 1);
var trackingMouse = false;
var trackballMove = false;
var lastPos = [0, 0, 0];
var curx, cury;
var startX, startY;
var slow = 0.0;

// variables for mouse translate
var keyboardToggle = false;
var translate = false;
var translateMatrix;
var translateMatrixLoc;




// universal draw init help
var shape = [0, 0, 0, 0, 0];

// perspective camera
var far = 10.0;
var near = 0.1;
var radius = 4.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;
var fovy = 45.0;
var aspect;
var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// light properties
var lightPosition = vec4(-1.5, 2.0, 4.0, 1.0);

//Mouse movement items
function trackballView( x,  y ) {
    var d, a;
    var v = [];

    v[0] = x;
    v[1] = y;

    d = v[0]*v[0] + v[1]*v[1];
    if (d < 1.0)
      v[2] = Math.sqrt(1.0 - d);
    else {
      v[2] = 0.0;
      a = 1.0 /  Math.sqrt(d);
      v[0] *= a;
      v[1] *= a;
    }
    return v;
}

function mouseMotion( x,  y)
{
    var dx, dy, dz;

    var curPos = trackballView(x, y);
    if(trackingMouse) {
      dx = curPos[0] - lastPos[0];
      dy = curPos[1] - lastPos[1];
      dz = curPos[2] - lastPos[2];

      if (dx || dy || dz) {
	       angle = -0.07 * Math.sqrt(dx*dx + dy*dy + dz*dz);

	       axis[0] = lastPos[1]*curPos[2] - lastPos[2]*curPos[1];
	       axis[1] = lastPos[2]*curPos[0] - lastPos[0]*curPos[2];
	       axis[2] = lastPos[0]*curPos[1] - lastPos[1]*curPos[0];

         lastPos[0] = curPos[0];
	       lastPos[1] = curPos[1];
	       lastPos[2] = curPos[2];
      }
    }
    render();
}

function startMotion( x,  y)
{
    trackingMouse = true;
    startX = x;
    startY = y;
    curx = x;
    cury = y;
    slow = 0.0;

    lastPos = trackballView(x, y);
	  trackballMove=true;
}

function stopMotion( x,  y)
{
    trackingMouse = false;
    if (startX != x || startY != y) {
    }
    else {
	     angle = 0.0;
	     trackballMove = false;
    }
}

// My translate addition items
function mouseTranslate(x, y)
{
    var dx, dy;

    var curPos = trackballView(x, y);
    if(trackingMouse) {
      dx = curPos[0] - lastPos[0];
      dy = curPos[1] - lastPos[1];

    translateMatrix = mat4 (
        1, 0.0, 0.0, 0.0,
        0.0, 1, 0.0, 0.0,
        0.0, 0.0, 1, 0.0,
        dx*0.75, dy*0.75, 0.0, 1);
    }
}

function startTranslate( x,  y)
{
    trackingMouse = true;
    startX = x;
    startY = y;
    curx = x;
    cury = y;

    lastPos = trackballView(x, y);
	translate=true;
}

function stopTranslate( x,  y)
{
    trackingMouse = false;

	translate = false;
}