var gl;

var initWebGL = function(canvas) {

    gl = null;

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch(e) {
        console.log(e);
    }

    return gl;
}

var start = function() {
    var canvas = document.getElementById("glcanvas");

    gl = initWebGL(canvas);

    if(!gl) {
        alert("No WebGL support!");
        return;
    }

    canvas.onresize = function() {
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    gl.clearColor(1, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
