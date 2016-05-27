(function() {

    var createScene = function(canvas, engine) {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 1, 12, new BABYLON.Vector3(0, -15, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, false);
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        var ground = BABYLON.Mesh.CreateGround('ground1', 60, 60, 2, scene);
        var groundMaterial = new BABYLON.StandardMaterial("mat-ground", scene);

        var groundTexture = new BABYLON.Texture("tex-floor.png", scene);
        groundTexture.uScale = 30.0;
        groundTexture.vScale = 30.0;
        groundMaterial.diffuseTexture = groundTexture;
        ground.material = groundMaterial;

        var pillarMaterial = new BABYLON.StandardMaterial("mat-pillar", scene);
        var pillarTexture = new BABYLON.Texture("tex-pillar.png", scene);
        pillarTexture.uScale = 2.0;
        pillarTexture.vScale = 2.0;
        pillarMaterial.diffuseTexture = pillarTexture;

        var makePillar = function(name) {
            var pillar = BABYLON.Mesh.CreateCylinder(name, 3, 1, 2, 6, 1, scene, false);
            pillar.position.y = 1.5;
            pillar.material = pillarMaterial;
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

        var makePlayer = function(name, color, x, y, z) {
            var player = BABYLON.Mesh.CreateCylinder(name, 1, 1, 1.5, 12, 1, scene, false);
            var head = BABYLON.Mesh.CreateSphere(name + '-head', 16, 1, scene);

            var material = new BABYLON.StandardMaterial(name + "-material", scene);
            material.diffuseColor = new BABYLON.Color3(color[0], color[1], color[2]);

            player.material = material;
            head.material = material;

            player.setPosition = function(x, y, z) {
                player.position.y = y;
                player.position.x = x;
                player.position.z = z;

                head.position.y = y + 0.5;
                head.position.x = x;
                head.position.z = z;
            }

            player.setPosition(x, y, z);

            return player;
        }

        var player0 = makePlayer("player0", [0.80, 0.10, 0.10], 0, 0.5, -3);
        var player1 = makePlayer("player1", [0.10, 0.80, 0.10], 0, 0.5, 3);
        var player2 = makePlayer("player2", [0.60, 0.30, 0.80], 3, 0.5, 0);
        var player3 = makePlayer("player3", [0.25, 0.50, 0.75], -3, 0.5, 0);

        var ballMaterial = new BABYLON.StandardMaterial("ball-texture", scene);
        ballMaterial.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
        ballMaterial.specularColor = new BABYLON.Color3(1.0, 0, 0);
        ballMaterial.emissiveColor = new BABYLON.Color3(0.05, 0, 0);

        var makeBall = function(name, x, y, z) {
            var ball = BABYLON.Mesh.CreateSphere(name, 8, 0.5, scene);
            ball.position.y = y;
            ball.position.x = x;
            ball.position.z = z;

            ball.material = ballMaterial;

            return ball;
        }

        var ball0 = makeBall("ball0", 1.5, 0.25, 0.66);
        var ball1 = makeBall("ball1", -0.75, 0.25, -0.70);
        var ball2 = makeBall("ball2", 0, 0.25, 0.25);
        var ball3 = makeBall("ball3", 1, 0.25, 0.5);

        var makeNet = function(name, position, scaling, color, x, y, z) {
            var net = BABYLON.Mesh.CreateBox(name, 0.5, scene);

            net.position.x = position[0];
            net.position.z = position[1];
            net.scaling.x = scaling[0];
            net.scaling.z = scaling[1];
            net.scaling.y = 0.5;

            var material = new BABYLON.StandardMaterial(name + "-material", scene);
            material.diffuseColor = new BABYLON.Color3(color[0], color[1], color[2]);
            material.alpha = 0.25;

            net.material = material;

            return net;
        }

        var net0 = makeNet("net0", [3, 0], [1, 10], [0.60, 0.30, 0.80]);
        var net1 = makeNet("net1", [-3, 0], [1, 10], [0.25, 0.50, 0.75]);
        var net2 = makeNet("net2", [0, 3], [10, 1], [0.10, 0.80, 0.10]);
        var net3 = makeNet("net3", [0, -3], [10, 1], [0.80, 0.10, 0.10]);

        var direction = 0.025;
        setInterval(function() {
            if(player0.position.x >= 1 || player0.position.x <= -1) {
                direction *= -1;
            }
            player0.setPosition(player0.position.x + direction, player0.position.y, player0.position.z);
            player1.setPosition(player1.position.x - direction, player1.position.y, player1.position.z);
            player2.setPosition(player2.position.x, player2.position.y, player2.position.z + direction);
            player3.setPosition(player3.position.x, player3.position.y, player3.position.z - direction);
        }, 16);

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
