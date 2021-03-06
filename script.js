(function() {

    var SOCKET_IO_ADDRESS = "http://127.0.0.1:3000"

    var playerPosition = undefined;
    var playerName = undefined;

    var autoplay = true;
    var balls = [];
    var players = [];

    var socket = undefined;

    var playerNames = [];
    var playerScores = [];

    var camera;

    var createScene = function(canvas, engine) {
        var scene = new BABYLON.Scene(engine);
        camera = new BABYLON.ArcRotateCamera("Camera", 0, 1, 12, new BABYLON.Vector3(0, -15, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        //camera.attachControl(canvas, false);
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        var lava = BABYLON.Mesh.CreateGround('lava', 60, 60, 2, scene);
        var lavaMaterial = new BABYLON.StandardMaterial("mat-lava", scene);
        var lavaTexture = new BABYLON.Texture("tex-lava.png", scene);
        lavaTexture.uScale = 10;
        lavaTexture.vScale = 10;
        lavaMaterial.diffuseTexture = lavaTexture;
        lava.position.y = -0.01;
        lava.material = lavaMaterial;

        var ground = BABYLON.Mesh.CreateGround('ground1', 9, 9, 2, scene);
        var groundMaterial = new BABYLON.StandardMaterial("mat-ground", scene);

        var groundTexture = new BABYLON.Texture("tex-floor.png", scene);
        groundTexture.uScale = 3.0;
        groundTexture.vScale = 3.0;
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

        players = [player0, player1, player2, player3];

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

        balls = [ball0, ball1, ball2, ball3];

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
            if(autoplay) {
                if(player0.position.x >= 1 || player0.position.x <= -1) {
                    direction *= -1;
                }
                player0.setPosition(player0.position.x + direction, player0.position.y, player0.position.z);
                player1.setPosition(player1.position.x - direction, player1.position.y, player1.position.z);
                player2.setPosition(player2.position.x, player2.position.y, player2.position.z + direction);
                player3.setPosition(player3.position.x, player3.position.y, player3.position.z - direction);

                if(playerPosition !== undefined) {
                    player2.setPosition(player2.position.x, player2.position.y, playerPosition);
                }
            }

            lavaTexture.uOffset += 0.001;
            lavaTexture.vOffset -= 0.001;
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

        playerNames = [
            document.getElementById("p1_name"),
            document.getElementById("p2_name"),
            document.getElementById("p3_name"),
            document.getElementById("p4_name")
        ];

        playerScores = [
            document.getElementById("p1_score"),
            document.getElementById("p2_score"),
            document.getElementById("p3_score"),
            document.getElementById("p4_score")
        ];

        var startForm = document.getElementById("startForm");

        var scalePosition = function(position) {
            return position * 6 - 3;
        }

        startForm.addEventListener("submit", function(e) {
            e.preventDefault();
            playerName = document.getElementById("name").value;

            document.getElementById("wrapper").className += " ingame";

            var elapsed = 0;

            var resizeEngine = function() {
                engine.resize();
                if(elapsed < 505) {
                    setTimeout(resizeEngine, 16);
                }
            }

            resizeEngine();

            if(playerName == "") {
                alert("Please input your name!");
                return;
            }

            console.log("Connecting to " + SOCKET_IO_ADDRESS);

            socket = io(SOCKET_IO_ADDRESS);

            socket.on("connect", function() {
                console.log("Connected");
                socket.emit("newPlayer", {
                    username: playerName
                });
            });

            socket.on("error", function(data) {
                console.log(error, data);
            });

            socket.on("disconnect", function() {
                console.log("Disconnected");
            });

            var oldNames = ['', '', '', ''];
            var oldScores = [-1, -1, -1, -1];

            socket.on('positionAssigned', function(data) {
                var cameraPosition;

                if(data.position == 'left') {
                    cameraPosition = 3.14;
                } else if(data.position == 'right') {
                    cameraPosition = 0;
                } else if(data.position == 'top') {
                    cameraPosition = 4.71;
                } else if(data.position == 'bottom') {
                    cameraPosition = 1.57;
                }

                camera.alpha = cameraPosition;
            });

            socket.on("world state", function(data) {
                //console.log("World data", data);
                autoplay = false;

                if(data.playerNames.top != oldNames[0]) {
                console.log('name change 0');
                    playerNames[0].innerHTML = data.playerNames.top;
                    oldNames[0] = data.playerNames.top;
                }

                if(data.scores.top != oldScores[0]) {
                    playerScores[0].innerHTML = data.scores.top;
                    oldScores[0] = data.scores.top;
                }

                if(data.playerNames.left != oldNames[1]) {
                    playerNames[1].innerHTML = data.playerNames.left;
                    oldNames[1] = data.playerNames.left;
                }

                if(data.scores.left != oldScores[1]) {
                    playerScores[1].innerHTML = data.scores.left;
                    oldScores[1] = data.scores.left;
                }

                if(data.playerNames.bottom != oldNames[2]) {
                    playerNames[2].innerHTML = data.playerNames.bottom;
                    oldNames[2] = data.playerNames.bottom;
                }

                if(data.scores.bottom!= oldScores[2]) {
                    playerScores[2].innerHTML = data.scores.bottom;
                    oldScores[2] = data.scores.bottom;
                }

                if(data.playerNames.right != oldNames[3]) {
                    playerNames[3].innerHTML = data.playerNames.right;
                    oldNames[3] = data.playerNames.right;
                }

                if(data.scores.right != oldScores[3]) {
                    playerScores[3].innerHTML = data.scores.right;
                    oldScores[3] = data.scores.right;
                }

                var i;

                for(i in data.balls) {
                    balls[i].position.x = scalePosition(data.balls[i][0])
                    balls[i].position.z = scalePosition(data.balls[i][1])
                    balls[i].position.y = 0.25;
                }

                for(i = parseInt(i) + 1; i < balls.length; ++i) {
                    balls[i].position.y = -1;
                }

                players[0].setPosition(scalePosition(data.topPlayer[0]), 0.5, scalePosition(data.topPlayer[1]));
                players[1].setPosition(scalePosition(data.bottomPlayer[0]), 0.5, scalePosition(data.bottomPlayer[1]));
                players[2].setPosition(scalePosition(data.rightPlayer[0]), 0.5, scalePosition(data.rightPlayer[1]));
                players[3].setPosition(scalePosition(data.leftPlayer[0]), 0.5, scalePosition(data.leftPlayer[1]));
            });

        });
        var LEFT_KEY = 37;
        var RIGHT_KEY = 39;
        var MOVE_AMOUNT = 0.15;

        var playerAction = function(direction) {
            if(playerPosition == undefined) {
                playerPosition = 0;
            }
            playerPosition += direction;
            playerPosition = Math.max(-1, playerPosition);
            playerPosition = Math.min(1, playerPosition);

            if(socket !== undefined) {
                var data = {
                    username: playerName
                };
                if(direction < 0) {
                    data.move = "right";
                } else {
                    data.move = "left";
                }
                socket.emit("movement", data);
            }
        }

        var keyTimeout;
        var activeMoveOption;

        var runKey = function() {
            playerAction(activeMoveOption);
            clearTimeout(keyTimeout);
            keyTimeout = setTimeout(runKey, 25);
        }

        canvas.addEventListener("touchstart", function(e) {
            var xTouch = e.touches[0].clientX;
            var distanceLeft = window.innerWidth - canvas.offsetWidth;
            var canvasTouchX = xTouch - distanceLeft;

            if(isNaN(xTouch)) {
                return;
            }

            if(canvasTouchX < canvas.offsetWidth / 2) {
                activeMoveOption = -MOVE_AMOUNT;
                if(!keyTimeout) {
                    runKey();
                }
            } else {
                activeMoveOption = MOVE_AMOUNT;
                if(!keyTimeout) {
                    runKey();
                }
            }

            e.stopPropagation();
            e.preventDefault();
        });

        canvas.addEventListener("touchend", function(e) {
            clearTimeout(keyTimeout);
            keyTimeout = undefined;
        });

        document.addEventListener("keydown", function(e) {

            if(e.keyCode == LEFT_KEY) {
                activeMoveOption = -MOVE_AMOUNT;
                if(!keyTimeout) {
                    runKey();
                }
                e.stopPropagation();
            } else if(e.keyCode == RIGHT_KEY) {
                activeMoveOption = MOVE_AMOUNT;
                if(!keyTimeout) {
                    runKey();
                }
                e.stopPropagation();
            }

        });

        document.addEventListener("keyup", function(e) {

            if(e.keyCode == LEFT_KEY || e.keyCode == RIGHT_KEY) {
                clearTimeout(keyTimeout);
                keyTimeout = undefined;
            }

        });

        });

})();
