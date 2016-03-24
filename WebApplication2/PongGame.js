(function () {
    var canvasInfo;
    var canvas;
    var ctx;
    var lastTime;

    var paddle = { "width": 13, "height": 100, "speed": 600 }; // this sets the defaults for the paddle
    var ballDefault = { "speed": 700 };

    var player1 = { "score": 0, "x": 0, "y": 0, "upKey": 87, "downKey": 83 }; //87 is keycode for w, 83 is keycode for s
    var player2 = { "score": 0, "x": 0, "y": 0, "upKey": 38, "downKey": 40 }; //38 is the keycode for up arrow, 40 for down arrow
    var ball = { "x": 0, "y": 0 , "dirX": 0, "dirY": 0, "speed": 0, "radius": 0};

    var keysDown = {};

    function normalizeVector(vectorX, vectorY) //this just normalizes the vector to 1
    {
        var scale = 1; //we want to scale it to 1
        var norm = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
        if (norm != 0)
        {
            vectorX = scale * vectorX / norm;
            vectorY = scale * vectorY / norm;
        }
        return { "x": vectorX, "y": vectorY };
    }

    function pointIntersectsRect(point, rect) //expects point to have x and y, and rect to have x, y, width, height
    {
        if (point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height) {
            return true;
        }
        else {
            return false;
        }
    }

    ///DRAWING FUNCTIONS
    function drawBackground()
    {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        ctx.strokeStyle = "#FFF";
        ctx.setLineDash([5, 15]);
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.beginPath();

        ctx.moveTo(canvas.clientWidth / 2, 0);
        ctx.lineTo(canvas.clientWidth / 2, canvas.clientHeight);
        ctx.stroke();
        //console.log(ctx.fillStyle + " width: " + canvas.clientWidth + " height: " +canvas.clientHeight);
    }

    function drawScore()
    {
        ctx.fillStyle = "#FFF";
        ctx.font = '18pt Arial';
        ctx.fillText(player1.score + ":" + player2.score, canvas.clientWidth / 2 - 20, 30);

    }

    function drawPlayers()
    {
        ctx.fillStyle = "#FFF";
        ctx.fillRect(player1.x, player1.y, paddle.width, paddle.height);
        ctx.fillRect(player2.x, player2.y, paddle.width, paddle.height);
    }

    function drawBall()
    {
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }

    function render() {
        //render background
        drawBackground();
        drawScore();
        drawPlayers();
        drawBall();
    }

    ///UPDATE FUNCTIONS

    function pauseGame()
    {
        speed 
    }

    function updateBall(dt)
    {
        ball.x += ball.dirX * ball.speed * dt;
        ball.y += ball.dirY * ball.speed * dt;
        if (pointIntersectsRect(ball, { "x": player1.x, "y": player1.y, "width": paddle.width, "height": paddle.height }))
        {
            ball.dirX = Math.abs(ball.dirX);
            ball.dirY = ((ball.y - player1.y) / paddle.height) - 0.5;
           // console.log("hit left");
        }
        if (pointIntersectsRect(ball, { "x": player2.x, "y": player2.y, "width": paddle.width, "height": paddle.height })) {
            ball.dirX = -Math.abs(ball.dirX);
            ball.dirY = ((ball.y - player2.y) / paddle.height) - 0.5;
           // console.log("hit right ");
        }
        if(ball.x < -75)
        {
            player2.score++;
            resetBallPosition();
            ball.dirX *= -1;
        }
        if(ball.x > canvas.clientWidth + 75)
        {
            player1.score++;
            resetBallPosition();
            ball.dirX *= -1;
        }
        if (ball.y < 0 || ball.y > canvas.clientHeight) ball.dirY *= -1;
        var norm = normalizeVector(ball.dirX, ball.dirY);
        ball.dirX = norm.x;
        ball.dirY = norm.y;
        
    }

    function updatePlayer(dt, player)
    {
        if(player.upKey in keysDown)
        {
            player.y -= paddle.speed * dt;
        }
        if(player.downKey in keysDown)
        {
            player.y += paddle.speed * dt;
        }
        if (player.y < 0) player.y = 0;
        if (player.y + paddle.height > canvas.clientHeight) player.y = canvas.clientHeight - paddle.height;
    }

    function update(dt) {
        updateBall(dt);
        updatePlayer(dt, player2);
        updatePlayer(dt, player1);
    }

    function gameLoop() {
        var now = Date.now();
        var dt = (now - lastTime) / 1000;

        update(dt);
        render();

        lastTime = now;

        requestAnimationFrame(gameLoop);
    }

    ///INITIALIZATION FUNCTIONS

    function initPlayers()
    {
        player1.x = 10;
        player1.y = canvas.clientHeight / 2 - paddle.height / 2;
        player2.x = canvas.clientWidth - paddle.width - 10;
        player2.y = canvas.clientHeight / 2 - paddle.height / 2;
       // console.log(player1 + player2);
    }

    function resetBallPosition()
    {
        ball.x = canvas.clientWidth / 2;
        ball.y = canvas.clientHeight / 2;
    }

    function initBall()
    {
        resetBallPosition();
        ball.dirX = -1.0;
        ball.dirY = 0.0;
        ball.speed = 700;
        ball.radius = 5;
    }

    function initInput()
    {
        addEventListener("keydown", function (e) { //this adds the keycode of whatever was pressed to keysDown
            keysDown[e.keyCode] = true;
        }, false);
        addEventListener("keyup", function (e) { //this removes the keycode of whatever was lifted
            delete keysDown[e.keyCode];
        }, false);
    }

    function init()
    {
        canvasInfo = this.canvasInfo;
        ctx = canvasInfo.ctx;
        canvas = canvasInfo.canvas;
        lastTime = this.lastTime;
        initPlayers();
        initBall();
        initInput();
        gameLoop();
    }

    var game = { "init": init };
    window.RPMPong = game;
})();