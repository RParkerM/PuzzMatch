(function () {

    var Objects = puzzmatch.Objects; //module for objects
    var Constants = puzzmatch.Constants; //module for constants

    //current constants for board and tile widths... 
    //TODO: put this in a seperate file?

    var BOARD_HEIGHT = 5;
    var BOARD_WIDTH = 6;
    var TILE_HEIGHT = 40;
    var TILE_WIDTH = 40;

    var blockTypes = 6;

    var canvasInfo;
    var canvas;
    var ctx;
    var lastTime;

    var tileImage2;
    
    var selectedBlock = null;
    var lastMousePos = null;

    var board;

    function solveBoard()
    {

    }

    function drawSelectedBlock() //this relies 
    {
        if(selectedBlock)
        {
            selectedBlock.drawSelected(ctx, lastMousePos.x, lastMousePos.y);
        }
    }

    function render() // this relies on board and drawselected block
    {
        //drawBoard(ctx);
        board.draw(ctx);
        drawSelectedBlock();
    }

    function update()
    {
        if(selectedBlock)
        {
            var coords = board.mouseToBlockCoords(lastMousePos);
            if(coords.row != selectedBlock.row || coords.column != selectedBlock.column)
            {
                console.log("over a dif block", coords);
                board.swapBlocks(selectedBlock, board.getBlock(coords.row, coords.column));
            }
        }
    }

    function gameLoop()
    {
        var now = Date.now();
        var dt = (now - lastTime) / 1000;

        update(dt);
        render();

        lastTime = now;
        requestAnimationFrame(gameLoop);
    }

    function startGame()
    {
        console.log("ran startGame()");
        if(window.resources.resourcesLoaded() == true)
        {   
            tileImage2 = window.resources.images["tileImage"];
            board = new Objects.Board(BOARD_HEIGHT, BOARD_WIDTH, TILE_HEIGHT, TILE_WIDTH, blockTypes);
            console.log(board);
            initCanvas(canvas);
            board.init(tileImage2);
            gameLoop();
        }
        else{
            requestAnimationFrame(startGame);
        }
    }

    function getMousePos(canvas, evt)
    {
        var rect = canvas.getBoundingClientRect();
        return {
            "x": evt.clientX - rect.left,
            "y": evt.clientY - rect.top
        };
    }
    
    function onMouseMove(e)
    {
        var mouse = getMousePos(canvas, e);
        lastMousePos = mouse;
    }

    function onMouseDown(e)
    {
        console.log(e);
        var mouse = getMousePos(canvas, e);
        lastMousePos = mouse;
        var pos = board.mouseToBlockCoords(mouse);
        selectedBlock = board.getBlock(pos.row, pos.column);
        selectedBlock.select();
        console.log(selectedBlock.description());
    }

    function onMouseUp(e)
    {
        if (selectedBlock)
        {
            selectedBlock.unselect();
            selectedBlock = null;
        }
    }

    function initCanvas(gameCanvas)
    {
        gameCanvas.onmousedown = onMouseDown;
        window.onmouseup = onMouseUp;
        window.onmousemove = onMouseMove;

        gameCanvas.width = board.getWidth();
        gameCanvas.height = board.getHeight();
    }

    function init()
    {
        window.resources.loadResources();

        canvasInfo = this.canvasInfo;
        canvas = canvasInfo.canvas;
        ctx = canvasInfo.ctx;

        lastTime = this.lastTime;

        startGame();
    }

    if(window.puzzmatch == null || typeof window.puzzmatch !== 'object')
    {
        window.puzzmatch = {};
    }
    window.puzzmatch.init = init;
})();