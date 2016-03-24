(function () {
    function initializeGameCanvas() {
        var gameContainer = document.getElementById('gameContainer');
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 640;
        canvas.height = 480;
        canvas.innerHTML = "Sorry, your browser doesn't seem to support the <canvas> tag.";
        canvas.style = "margin: 0 auto; padding: 0px;";
        gameContainer.appendChild(canvas);
        return {"canvas": canvas,"ctx": ctx};
    }

    function render()
    {

    }
    function update()
    {

    }

    function gameLoop()
    {
        var now = Date.now();
        var dt = (now - this.lastTime) / 1000;

        update(dt);
        render();

        this.lastTime = now;
        //console.log(this);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    function main() {
        
        var canvasInfo = initializeGameCanvas();
        var game = { "init": RPMPong.init, "canvasInfo": canvasInfo, "lastTime": Date.now() };
        //game.init = puzzmatch.init;
        game.init();
    }
    
    window.onload = (function (oldOnLoad) { return function () { oldOnLoad && oldOnLoad(); main(); } })(window.onload);
})();