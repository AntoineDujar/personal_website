"use strict";
var gl;
var guy;

var spin = [0, 0, 0];
var spinBool = true;
var spinLoc;
var spinDirection = true;

// webGL variables
var canvas = document.getElementById("gl-canvas");
gl = canvas.getContext('webgl2');
if (!gl) {alert("WebGL 2.0 isn't available");}
var program = initShaders(gl, "vertex-shader", "fragment-shader");

//Main code on load
window.onload = function init()
{
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(program);


    guy = new character(0.0, 0.0, 0.0);

    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),flatten(lightPosition));

    aspect = canvas.width/canvas.height;

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    rotationMatrix = mat4();
    rotationMatrixLoc = gl.getUniformLocation(program, "uRotationMatrix");
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));

    translateMatrix = mat4();
    translateMatrixLoc = gl.getUniformLocation(program, "uTranslateMatrix");
    gl.uniformMatrix4fv(translateMatrixLoc, false, flatten(translateMatrix));

    spinLoc = gl.getUniformLocation(program, "uSpin");

    document.getElementById( "rotation" ).onclick = function () {
        if(spinBool == false) {
            spinBool = true;
        } else {
            spinBool = false;
        }
    };

    document.getElementById( "rotationDirection" ).onclick = function () {
        if(spinDirection == false) {
            spinDirection = true;
        } else {
            spinDirection = false;
        }
    };

    document.getElementById( "lightLeft" ).onclick = function () {
        lightPosition = vec4(lightPosition[0]-3, lightPosition[1], lightPosition[2], lightPosition[3])
        console.log(lightPosition[0]);
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),flatten(lightPosition));
    };

    document.getElementById( "lightRight" ).onclick = function () {
        lightPosition = vec4(lightPosition[0]+3, lightPosition[1], lightPosition[2], lightPosition[3])
        console.log(lightPosition[0]);
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),flatten(lightPosition));
    };
    
    document.getElementById( "theta-" ).onclick = function () {
        armTheta -= 5.0;
        console.log(armTheta);
    };

    document.getElementById( "theta+" ).onclick = function () {
        armTheta += 5.0;
        console.log(armTheta);
    };

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (spinBool == true) {
        if (spinDirection == true) {
            spin[1] += 0.1;
        } else {
            spin[1] -= 0.1;
        }
    }

    gl.uniform3fv(spinLoc, spin);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi), radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    modelViewMatrix = lookAt (eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    if(trackballMove) {
        axis = normalize(axis);
        angle = angle * (1-slow);
        rotationMatrix = mult(rotationMatrix, rotate(angle, axis));
        gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));
        if (slow <1){
            slow = slow + 0.0000001;
        } 
    }
    if(translate) {
        gl.uniformMatrix4fv(translateMatrixLoc, false, flatten(translateMatrix));
    }

    guy.draw()

    requestAnimationFrame(render);
}