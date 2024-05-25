var lightPosition = vec4(-1.5, 2.0, 4.0, 1.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
// arm rotation
var armTheta = 0.0;

class character {
    constructor (x, y, z) {
        this.torso1 = new torso(0.0, -0.1, 0.0);
        this.head1 = new head(0.0, 0.5, 0.0);
        this.arm1 = new armL(0.45, 0.15, 0.0);
        this.arm2 = new armR(-0.45, 0.15, 0.0);
    }

    draw () {
        this.torso1.draw();
        this.head1. draw();
        this.arm1. draw();
        this.arm2. draw();
    }
}

class torso {
    constructor (x,y,z) {
        this.init(x,y,z);
    }

    init(x,y,z) {
        this.vertices = [
            vec4(-0.15+x, -0.35+y,  0.15+z, 1.0),
            vec4(-0.15+x,  0.35+y,  0.15+z, 1.0),
            vec4(0.15+x,  0.35+y,  0.15+z, 1.0),
            vec4(0.15+x, -0.35+y,  0.15+z, 1.0),
            vec4(-0.15+x, -0.35+y, -0.15+z, 1.0),
            vec4(-0.15+x,  0.35+y, -0.15+z, 1.0),
            vec4(0.15+x,  0.35+y, -0.15+z, 1.0),
            vec4(0.15+x, -0.35+y, -0.15+z, 1.0)
        ];

        this.indices = [
            1, 0, 3,
            3, 2, 1,
            2, 3, 7,
            7, 6, 2,
            3, 0, 4,
            4, 7, 3,
            6, 5, 1,
            1, 2, 6,
            4, 5, 6,
            6, 7, 4,
            5, 4, 0,
            0, 1, 5
        ];

        this.translateMatrix = mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0);
        
        //buffers
        this.nBuffer = gl.createBuffer();
        this.normalLoc = gl.getAttribLocation(program, "aNormal");
        this.vBuffer = gl.createBuffer();
        this.iBuffer = gl.createBuffer();
        this.positionLoc = gl.getAttribLocation(program, "aPosition");
        this.invidivualMatrixLoc = gl.getUniformLocation(program, "uIndividualMatrix");

        this.positionsArray = [];
        this.normalsArray = [];

        this.colourCube();

        this.materialAmbient = vec4(0.8, 0.8, 0.8, 1.0);
        this.materialDiffuse = vec4(0.9, 0.2, 0.3, 1.0);
        this.materialSpecular = vec4(0.0, 0.4, 0.4, 1.0);
        this.materialShininess = 700.0;

        this.ambientProduct = mult(lightAmbient, this.materialAmbient);
        this.diffuseProduct = mult(lightDiffuse, this.materialDiffuse);
        this.specularProduct = mult(lightSpecular, this.materialSpecular);
        console.log(this.ambientProduct);

        gl.uniform4fv(gl.getUniformLocation(program,"uAmbientProduct"),flatten(this.ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),flatten(this.diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),flatten(this.specularProduct));
        gl.uniform1f(gl.getUniformLocation(program, "uShininess"),this.materialShininess);    
    }

    colourCube() {
    this.quad(1, 0, 3, 2);
    this.quad(2, 3, 7, 6);
    this.quad(3, 0, 4, 7);
    this.quad(6, 5, 1, 2);
    this.quad(4, 5, 6, 7);
    this.quad(5, 4, 0, 1);
    }

    quad(a, b, c, d) {
        this.t1 = subtract(this.vertices[b], this.vertices[a]);
        this.t2 = subtract(this.vertices[c], this.vertices[b]);
        this.normal = cross(this.t1, this.t2);
        this.normal = vec3(this.normal);
    
        this.positionsArray.push(this.vertices[a]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[b]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[c]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[a]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[c]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[d]);
        this.normalsArray.push(this.normal);
    }

    draw() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.normalLoc);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.positionsArray), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionLoc);

        gl.uniformMatrix4fv(this.invidivualMatrixLoc, false, flatten(this.translateMatrix));

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}

class head {
    constructor (x,y,z) {
        this.init(x,y,z);
    }

    init(x,y,z) {
        this.vertices = [
            vec4(-0.15+x, -0.15+y,  0.15+z, 1.0),
            vec4(-0.15+x,  0.15+y,  0.15+z, 1.0),
            vec4(0.15+x,  0.15+y,  0.15+z, 1.0),
            vec4(0.15+x, -0.15+y,  0.15+z, 1.0),
            vec4(-0.15+x, -0.15+y, -0.15+z, 1.0),
            vec4(-0.15+x,  0.15+y, -0.15+z, 1.0),
            vec4(0.15+x,  0.15+y, -0.15+z, 1.0),
            vec4(0.15+x, -0.15+y, -0.15+z, 1.0)
        ];

        this.indices = [
            1, 0, 3,
            3, 2, 1,
            2, 3, 7,
            7, 6, 2,
            3, 0, 4,
            4, 7, 3,
            6, 5, 1,
            1, 2, 6,
            4, 5, 6,
            6, 7, 4,
            5, 4, 0,
            0, 1, 5
        ];

        this.translateMatrix = mat4(
                0.8, 0.0, 0.0, 0.0,
                0.0, 0.8, 0.0, 0.0,
                0.0, 0.0, 0.8, 0.0,
                0.0, 0.0, 0.0, 1.0);
        
        //buffers
        this.nBuffer = gl.createBuffer();
        this.normalLoc = gl.getAttribLocation(program, "aNormal");
        this.vBuffer = gl.createBuffer();
        this.iBuffer = gl.createBuffer();
        this.positionLoc = gl.getAttribLocation(program, "aPosition");
        this.invidivualMatrixLoc = gl.getUniformLocation(program, "uIndividualMatrix");

        this.positionsArray = [];
        this.normalsArray = [];

        this.colourCube();

        this.materialAmbient = vec4(0.8, 0.8, 0.8, 1.0);
        this.materialDiffuse = vec4(0.9, 0.2, 0.3, 1.0);
        this.materialSpecular = vec4(0.0, 0.4, 0.4, 1.0);
        this.materialShininess = 700.0;

        this.ambientProduct = mult(lightAmbient, this.materialAmbient);
        this.diffuseProduct = mult(lightDiffuse, this.materialDiffuse);
        this.specularProduct = mult(lightSpecular, this.materialSpecular);

        gl.uniform4fv(gl.getUniformLocation(program,"uAmbientProduct"),flatten(this.ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),flatten(this.diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),flatten(this.specularProduct));
        gl.uniform1f(gl.getUniformLocation(program, "uShininess"),this.materialShininess);    
    }

    colourCube() {
    this.quad(1, 0, 3, 2);
    this.quad(2, 3, 7, 6);
    this.quad(3, 0, 4, 7);
    this.quad(6, 5, 1, 2);
    this.quad(4, 5, 6, 7);
    this.quad(5, 4, 0, 1);
    }

    quad(a, b, c, d) {
        this.t1 = subtract(this.vertices[b], this.vertices[a]);
        this.t2 = subtract(this.vertices[c], this.vertices[b]);
        this.normal = cross(this.t1, this.t2);
        this.normal = vec3(this.normal);
    
        this.positionsArray.push(this.vertices[a]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[b]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[c]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[a]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[c]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[d]);
        this.normalsArray.push(this.normal);
    }

    draw() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.normalLoc);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.positionsArray), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionLoc);

        gl.uniformMatrix4fv(this.invidivualMatrixLoc, false, flatten(this.translateMatrix));

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}










class armL {
    constructor (x,y,z) {
        this.init(x,y,z);
    }

    init(x,y,z) {
        this.vertices = [
            vec4(-0.25+x, -0.10+y,  0.10+z, 1.0),
            vec4(-0.25+x,  0.10+y,  0.10+z, 1.0),
            vec4(0.25+x,  0.10+y,  0.10+z, 1.0),
            vec4(0.25+x, -0.10+y,  0.10+z, 1.0),
            vec4(-0.25+x, -0.10+y, -0.10+z, 1.0),
            vec4(-0.25+x,  0.10+y, -0.10+z, 1.0),
            vec4(0.25+x,  0.10+y, -0.10+z, 1.0),
            vec4(0.25+x, -0.10+y, -0.10+z, 1.0)
        ];

        this.indices = [
            1, 0, 3,
            3, 2, 1,
            2, 3, 7,
            7, 6, 2,
            3, 0, 4,
            4, 7, 3,
            6, 5, 1,
            1, 2, 6,
            4, 5, 6,
            6, 7, 4,
            5, 4, 0,
            0, 1, 5
        ];
        this.angle = degrees_to_radians(armTheta);
        this.cos = Math.cos(this.angle);
        this.sin = Math.sin(this.angle);

        this.translateMatrix = mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0,0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0);

        this.rx = mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, this.cos,this.sin, 0.0,
            0.0, -this.sin, this.cos, 0.0,
            0.0, 0.0, 0.0, 1.0);
        
        this.ry = mat4(
            this.cos, 0.0, -this.sin, 0.0,
            0.0, 1.0,0.0, 0.0,
            this.sin, 0.0, this.cos, 0.0,
            0.0, 0.0, 0.0, 1.0);

        this.rz = mat4(
            this.cos, this.sin, 0.0, 0.0,
            -this.sin, this.cos,0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        
        this.translateMatrix = mult(mult(mult(this.rz, this.ry), this.rx), this.translateMatrix);
        //buffers
        this.nBuffer = gl.createBuffer();
        this.normalLoc = gl.getAttribLocation(program, "aNormal");
        this.vBuffer = gl.createBuffer();
        this.iBuffer = gl.createBuffer();
        this.positionLoc = gl.getAttribLocation(program, "aPosition");
        this.invidivualMatrixLoc = gl.getUniformLocation(program, "uIndividualMatrix");

        this.positionsArray = [];
        this.normalsArray = [];

        this.colourCube();

        this.materialAmbient = vec4(0.8, 0.8, 0.8, 1.0);
        this.materialDiffuse = vec4(0.9, 0.2, 0.3, 1.0);
        this.materialSpecular = vec4(0.0, 0.4, 0.4, 1.0);
        this.materialShininess = 700.0;

        this.ambientProduct = mult(lightAmbient, this.materialAmbient);
        this.diffuseProduct = mult(lightDiffuse, this.materialDiffuse);
        this.specularProduct = mult(lightSpecular, this.materialSpecular);

        gl.uniform4fv(gl.getUniformLocation(program,"uAmbientProduct"),flatten(this.ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),flatten(this.diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),flatten(this.specularProduct));
        gl.uniform1f(gl.getUniformLocation(program, "uShininess"),this.materialShininess);    
    }

    colourCube() {
    this.quad(1, 0, 3, 2);
    this.quad(2, 3, 7, 6);
    this.quad(3, 0, 4, 7);
    this.quad(6, 5, 1, 2);
    this.quad(4, 5, 6, 7);
    this.quad(5, 4, 0, 1);
    }

    quad(a, b, c, d) {
        this.t1 = subtract(this.vertices[b], this.vertices[a]);
        this.t2 = subtract(this.vertices[c], this.vertices[b]);
        this.normal = cross(this.t1, this.t2);
        this.normal = vec3(this.normal);
    
        this.positionsArray.push(this.vertices[a]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[b]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[c]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[a]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[c]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[d]);
        this.normalsArray.push(this.normal);
    }

    draw() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.normalLoc);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.positionsArray), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionLoc);

        this.angle = degrees_to_radians(armTheta);
        this.cos = Math.cos(this.angle);
        this.sin = Math.sin(this.angle);

        this.translateMatrix = mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0,0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0);

        this.rx = mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, this.cos,this.sin, 0.0,
            0.0, -this.sin, this.cos, 0.0,
            0.0, 0.0, 0.0, 1.0);
        
        this.ry = mat4(
            this.cos, 0.0, -this.sin, 0.0,
            0.0, 1.0,0.0, 0.0,
            this.sin, 0.0, this.cos, 0.0,
            0.0, 0.0, 0.0, 1.0);

        this.rz = mat4(
            this.cos, this.sin, 0.0, 0.0,
            -this.sin, this.cos,0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        
        this.translateMatrix = mult(this.rz, this.translateMatrix);
        gl.uniformMatrix4fv(this.invidivualMatrixLoc, false, flatten(this.translateMatrix));

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}






class armR {
    constructor (x,y,z) {
        this.init(x,y,z);
    }

    init(x,y,z) {
        this.vertices = [
            vec4(-0.25+x, -0.10+y,  0.10+z, 1.0),
            vec4(-0.25+x,  0.10+y,  0.10+z, 1.0),
            vec4(0.25+x,  0.10+y,  0.10+z, 1.0),
            vec4(0.25+x, -0.10+y,  0.10+z, 1.0),
            vec4(-0.25+x, -0.10+y, -0.10+z, 1.0),
            vec4(-0.25+x,  0.10+y, -0.10+z, 1.0),
            vec4(0.25+x,  0.10+y, -0.10+z, 1.0),
            vec4(0.25+x, -0.10+y, -0.10+z, 1.0)
        ];

        this.indices = [
            1, 0, 3,
            3, 2, 1,
            2, 3, 7,
            7, 6, 2,
            3, 0, 4,
            4, 7, 3,
            6, 5, 1,
            1, 2, 6,
            4, 5, 6,
            6, 7, 4,
            5, 4, 0,
            0, 1, 5
        ];
        this.angle = degrees_to_radians(armTheta);
        this.cos = Math.cos(this.angle);
        this.sin = Math.sin(this.angle);

        this.translateMatrix = mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0,0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0);

        this.rx = mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, this.cos,this.sin, 0.0,
            0.0, -this.sin, this.cos, 0.0,
            0.0, 0.0, 0.0, 1.0);
        
        this.ry = mat4(
            this.cos, 0.0, -this.sin, 0.0,
            0.0, 1.0,0.0, 0.0,
            this.sin, 0.0, this.cos, 0.0,
            0.0, 0.0, 0.0, 1.0);

        this.rz = mat4(
            this.cos, this.sin, 0.0, 0.0,
            -this.sin, this.cos,0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        
        this.translateMatrix = mult(mult(mult(this.rz, this.ry), this.rx), this.translateMatrix);
        //buffers
        this.nBuffer = gl.createBuffer();
        this.normalLoc = gl.getAttribLocation(program, "aNormal");
        this.vBuffer = gl.createBuffer();
        this.iBuffer = gl.createBuffer();
        this.positionLoc = gl.getAttribLocation(program, "aPosition");
        this.invidivualMatrixLoc = gl.getUniformLocation(program, "uIndividualMatrix");

        this.positionsArray = [];
        this.normalsArray = [];

        this.colourCube();

        this.materialAmbient = vec4(0.8, 0.8, 0.8, 1.0);
        this.materialDiffuse = vec4(0.9, 0.2, 0.3, 1.0);
        this.materialSpecular = vec4(0.0, 0.4, 0.4, 1.0);
        this.materialShininess = 700.0;

        this.ambientProduct = mult(lightAmbient, this.materialAmbient);
        this.diffuseProduct = mult(lightDiffuse, this.materialDiffuse);
        this.specularProduct = mult(lightSpecular, this.materialSpecular);

        gl.uniform4fv(gl.getUniformLocation(program,"uAmbientProduct"),flatten(this.ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),flatten(this.diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),flatten(this.specularProduct));
        gl.uniform1f(gl.getUniformLocation(program, "uShininess"),this.materialShininess);    
    }

    colourCube() {
    this.quad(1, 0, 3, 2);
    this.quad(2, 3, 7, 6);
    this.quad(3, 0, 4, 7);
    this.quad(6, 5, 1, 2);
    this.quad(4, 5, 6, 7);
    this.quad(5, 4, 0, 1);
    }

    quad(a, b, c, d) {
        this.t1 = subtract(this.vertices[b], this.vertices[a]);
        this.t2 = subtract(this.vertices[c], this.vertices[b]);
        this.normal = cross(this.t1, this.t2);
        this.normal = vec3(this.normal);
    
        this.positionsArray.push(this.vertices[a]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[b]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[c]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[a]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[c]);
        this.normalsArray.push(this.normal);
        this.positionsArray.push(this.vertices[d]);
        this.normalsArray.push(this.normal);
    }

    draw() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.normalLoc);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.positionsArray), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionLoc);

        this.angle = degrees_to_radians(-armTheta);
        this.cos = Math.cos(this.angle);
        this.sin = Math.sin(this.angle);

        this.translateMatrix = mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0,0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0);

        this.rx = mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, this.cos,this.sin, 0.0,
            0.0, -this.sin, this.cos, 0.0,
            0.0, 0.0, 0.0, 1.0);
        
        this.ry = mat4(
            this.cos, 0.0, -this.sin, 0.0,
            0.0, 1.0,0.0, 0.0,
            this.sin, 0.0, this.cos, 0.0,
            0.0, 0.0, 0.0, 1.0);

        this.rz = mat4(
            this.cos, this.sin, 0.0, 0.0,
            -this.sin, this.cos,0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        
        this.translateMatrix = mult(this.rz, this.translateMatrix);
        gl.uniformMatrix4fv(this.invidivualMatrixLoc, false, flatten(this.translateMatrix));

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}