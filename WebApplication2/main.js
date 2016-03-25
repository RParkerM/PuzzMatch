//Important: Always include this file last
//Main file for creating the canvas, and initializing the game


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

    function main() {
        
        var canvasInfo = initializeGameCanvas();
        var game = { "init": puzzmatch.init, "canvasInfo": canvasInfo, "lastTime": Date.now() };
        game.init();
    }
    
    window.onload = (function (oldOnLoad) { return function () { oldOnLoad && oldOnLoad(); main(); } })(window.onload);
})();