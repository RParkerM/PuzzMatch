(function () {

    var Objects = puzzmatch.Objects; //module for objects
    var Constants = puzzmatch.Constants; //module for constants

    //current constants for board and tile widths... 
    //TODO: put this in a seperate file?

    var BOARD_HEIGHT = Constants.BOARD_HEIGHT;
    var BOARD_WIDTH = Constants.BOARD_WIDTH;
    var TILE_HEIGHT = Constants.TILE_HEIGHT;
    var TILE_WIDTH = Constants.TILE_WIDTH;

    var BLOCK_TYPES = Constants.BLOCK_TYPES;

    var SCALE_X = 3;
    var SCALE_Y = 3;

    var canvasInfo;
    var canvas;
    var ctx;
    var lastTime;

    var tileImage2;
    
    var selectedBlock = null;
    var lastMousePos = null;

    var board;


    function drawSelectedBlock() //this relies  on ctx, lastMousPos
    {
        
        if(selectedBlock)
        {
            var x = Math.min(lastMousePos.x, canvas.width/SCALE_X);// - TILE_WIDTH/2 * SCALE_X);
            var y = Math.min(lastMousePos.y, canvas.height/SCALE_Y);// - TILE_HEIGHT / 2 * SCALE_Y);
            x = Math.max(0, x);
            y = Math.max(0, y);
            //console.log("selectedBlock", selectedBlock, "positions:", { "x": x, "y": y }, "canvas dimensions", { "width": canvas.width, "height": canvas.height });
            selectedBlock.drawSelected(ctx, x, y);
        }
    }

    function drawBackground(context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function render() // this relies on board and drawselected block
    {
        drawBackground(ctx);
        board.draw(ctx);
        drawSelectedBlock();
    }

    function update()
    {
        if(selectedBlock)
        {
            var coords = board.mouseToBlockCoords(lastMousePos);
            if(coords.row != selectedBlock.row || coords.column != selectedBlock.column) //
            {
                board.swapBlocks(selectedBlock, board.getBlock(coords.row, coords.column));
            }
        }
        board.update();
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

    function startGame() //this tries to start the game, but waits until all resources are loaded
    {
        if(window.resources.resourcesLoaded() == true)
        {   
            tileImage2 = window.resources.images["tileImage"];
            board = new Objects.Board(BOARD_HEIGHT, BOARD_WIDTH, TILE_HEIGHT, TILE_WIDTH, BLOCK_TYPES);
            window.BOARD = board;
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
            "x": (evt.clientX - rect.left)/SCALE_X,
            "y": (evt.clientY - rect.top)/SCALE_Y
        };
    }
    function getTouchPos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            "x": (evt.touches[0].clientX - rect.left)/SCALE_X,
            "y": (evt.touches[0].clientY - rect.top)/SCALE_Y
        }
    }

    /// MOUSE FUNCTIONS
    function onMouseMove(e)
    {
        var mouse = getMousePos(canvas, e);
        lastMousePos = mouse;
    }

    function onMouseDown(e)
    {
        var mouse = getMousePos(canvas, e);
        lastMousePos = mouse;
        var pos = board.mouseToBlockCoords(mouse);
        selectedBlock = board.getBlock(pos.row, pos.column);
        selectedBlock.select();
        //console.log(selectedBlock.description());
    }

    function onMouseUp(e){
        if (selectedBlock)
        {
            selectedBlock.unselect();
            selectedBlock = null;
            board.solveBoard();
        }
    }

    function onTouchStart(e) {
        e.preventDefault();
        var touchPos = getTouchPos(canvas, e);
        lastMousePos = touchPos;
        var pos = board.mouseToBlockCoords(touchPos);
        selectedBlock = board.getBlock(pos.row, pos.column);
        selectedBlock.select();
       // console.log(selectedBlock.description());
    }
    function onTouchEnd(e) {
       e.preventDefault();
        if (selectedBlock) {
            selectedBlock.unselect();
            selectedBlock = null;
            board.solveBoard();
        }
    }
    function onTouchMove(e) {
        e.preventDefault();
        var touchPos = getTouchPos(canvas, e);
        lastMousePos = touchPos;
    }

    function initCanvas(gameCanvas)
    {
        gameCanvas.onmousedown = onMouseDown;
        window.onmouseup = onMouseUp;
        window.onmousemove = onMouseMove;

        gameCanvas.addEventListener("touchstart", onTouchStart);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchEnd);
        window.ontouchend = onTouchEnd;
        window.ontouchmove = onTouchMove;

        gameCanvas.width = board.getWidth() * SCALE_X;
        gameCanvas.height = board.getHeight() * SCALE_Y;
        gameCanvas.getContext('2d').scale(SCALE_X, SCALE_Y);
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