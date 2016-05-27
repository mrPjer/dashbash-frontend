(function() {

    var createScene = function(canvas, engine) {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, -15, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, false);
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
        var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

        var makePillar = function(name) {
            var pillar = BABYLON.Mesh.CreateCylinder(name, 3, 1, 2, 6, 1, scene, false);
            pillar.position.y = 1.5;
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

        var makePlayer = function(name, x, y, z) {
            var player = BABYLON.Mesh.CreateCylinder(name, 1, 1, 1.5, 12, 1, scene, false);
            var head = BABYLON.Mesh.CreateSphere(name + '-head', 16, 1, scene);
            player.position.y = y;
            player.position.x = x;
            player.position.z = z;

            head.position.y = y + 0.5;
            head.position.x = x;
            head.position.z = z;

            return player;
        }

        var player0 = makePlayer("player0", 0, 0.5, -3);
        var player1 = makePlayer("player1", 0, 0.5, 3);
        var player2 = makePlayer("player2", 3, 0.5, 0);
        var player3 = makePlayer("player3", -3, 0.5, 0);

        var makeBall = function(name, x, y, z) {
            var ball = BABYLON.Mesh.CreateSphere(name, 8, 0.5, scene);
            ball.position.y = y;
            ball.position.x = x;
            ball.position.z = z;
        }

        var ball0 = makeBall("ball0", 1.5, 0.25, 0.66);
        var ball0 = makeBall("ball1", -0.75, 0.25, -0.70);
        var ball0 = makeBall("ball2", 0, 0.25, 0.25);
        var ball0 = makeBall("ball3", 1, 0.25, 0.5);

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
