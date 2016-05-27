(function() {

    var createScene = function(canvas, engine) {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, -15, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, false);
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
        var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        sphere.position.y = 1;
        var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

        var makePillar = function(name) {
            var pillar = BABYLON.Mesh.CreateCylinder(name, 3, 1, 2, 6, 1, scene, false);
            pillar.position.y = 1;
            return pillar;
        }

        var pillarTopLeft = makePillar("pill_0");
        var pillarTopRight = makePillar("pill_1");
        var pillarBottomLeft = makePillar("pill_2");
        var pillarBottomRight = makePillar("pill_3");

        pillarTopLeft.position.x = -3;
        pillarTopLeft.position.z = -3;

        pillarTopRight.position.x = -3;
        pillarTopRight.position.z = 3;

        pillarBottomLeft.position.x = 3;
        pillarBottomLeft.position.z = -3;

        pillarBottomRight.position.x = 3;
        pillarBottomRight.position.z = 3;


        return scene;
    }

    window.addEventListener("DOMContentLoaded", function() {
        var canvas = document.getElementById("glcanvas");

        var engine = new BABYLON.Engine(canvas, true);

        var scene = createScene(canvas, engine);

        window.addEventListener('resize', function() {
            engine.resize();
        });

        engine.runRenderLoop(function() {
            scene.render();
        });
    });
})();
