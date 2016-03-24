(function () {
    var BOARD_HEIGHT = 5;
    var BOARD_WIDTH = 6;

    var TILE_HEIGHT = 40;
    var TILE_WIDTH = 40;

    var blockTypes = 6;

    var canvasInfo;
    var canvas;
    var ctx;
    var lastTime;

    var resourcesLoaded = false;

    var tileImage;
    
    var selectedBlock = null;
    var lastMousePos = null;

    var TILE_SELECT_SIZE_MOD = 1.3;


    function block(type, column, row)
    {
        this.column = column;
        this.row = row;
        this.type = type;
        this.selected = false;

        this.description = function () {
            return "Block type: " + this.type + " Position: " + this.row + "," + this.column + ".";
        };

        this.draw = function () { //relies on ctx, tileImage, TILE_WIDTH, TILE_HEIGHT
            ctx.save();
            if(this.selected == true) ctx.globalAlpha = 0.5;
            ctx.drawImage(tileImage, this.type * TILE_WIDTH, 0, TILE_WIDTH, TILE_HEIGHT, this.column * TILE_WIDTH, this.row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            //format is ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            ctx.restore();
        };

        this.select = function () {
            this.selected = true;
        };
        
        this.unselect = function () {
            this.selected = false;
        };        
    }

    function board2() {
        
    }
    var board = { // relies on BOARD_HEIGHT, BOARD_WIDTH, TILE_WIDTH, TILE_HEIGHT
        "numRows": BOARD_HEIGHT,
        "numColumns": BOARD_WIDTH,
        "field": [],
        "shuffle": function () {
            for(var y = 0; y < this.numRows; y++)
            {
                for(var x = 0; x < this.numColumns; x++)
                {
                    do{
                        var blockType = Math.floor(Math.random()*blockTypes);
                    }while((x >= 2 && blockType == this.field[y * this.numColumns + x - 1] && blockType == this.field[y * this.numColumns + x -2 ]) 
                        || (y >= 2 && blockType == this.field[(y - 1)*this.numColumns + x] && blockType == this.field[(y - 2)*this.numColumns + x]));
                    this.field[y * this.numColumns + x] = new block((blockType),x,y);
                }
            }
        },
        "coordsToColRow": function (coords) {
            //console.log(coords);
            var col = Math.floor(coords.x / TILE_WIDTH);
            var row = Math.floor(coords.y / TILE_HEIGHT);
            if (row < 0)
            {
                row = 0;
            }
            else if (row >= this.numRows)
            {
                row = this.numRows - 1;
            }
            if (col < 0) {
                col = 0;
            }
            else if (col >= this.numColumns)
            {
                col = this.numColumns - 1;
            }
            //console.log(row, col);
            return { "row": row, "col": col };
            
        },
        "init": function () {
            this.field.length = this.numRows * this.numColumns;
            this.shuffle();
            for(var i = 0; i < this.field.length; i++)
            {
                //console.log(this.field[i]);
            }
        },
        "getBlock": function(row, column)
        {
            if(column >= 0 && column < this.numColumns && row >= 0 && row >= 0 && row < this.numRows)
            {
                return this.field[row*this.numColumns + column];
            }
        },
        "setBlock": function(row, column, block)
        {
            if(column >= 0 && column < this.numColumns && row >= 0 && row < this.numRows)
            {
                this.field[row * this.numColumns + column] = block;
            }
        },
        "swapBlocks": function(block1, block2)
        {
            var tempRow = block1.row;
            var tempCol = block1.column;
            block1.row = block2.row;
            block1.column = block2.column;
            block2.row = tempRow;
            block2.column = tempCol;

            this.setBlock(block1.row, block1.column, block1);
            this.setBlock(block2.row, block2.column, block2);
        }
    };

    function solveBoard()
    {

    }

    function drawBoard() //relies on ctx. this should be in board.... 
    {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, board.numColumns * TILE_WIDTH, board.numRows * TILE_HEIGHT);
        for(var i = 0; i < board.field.length; i++)
        {
            
            board.field[i].draw();
            //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        }
        //ctx.drawImage(tileImage,0,0);
    }

    function drawSelectedBlock() //this relies 
    {
        if(selectedBlock)
        {
            ctx.save();
            ctx.globalAlpha = 0.8;
            ctx.drawImage(tileImage, selectedBlock.type * TILE_WIDTH, 0, TILE_WIDTH, TILE_HEIGHT, lastMousePos.x - TILE_WIDTH * TILE_SELECT_SIZE_MOD / 2, lastMousePos.y - TILE_HEIGHT * TILE_SELECT_SIZE_MOD / 2, TILE_WIDTH * TILE_SELECT_SIZE_MOD, TILE_HEIGHT * TILE_SELECT_SIZE_MOD)
            ctx.restore();
        }
    }

    function render() // this relies on board and drawselected block
    {
        drawBoard();
        drawSelectedBlock();
    }

    function update()
    {
        if(selectedBlock)
        {
            var coords = board.coordsToColRow(lastMousePos);
            if(coords.row != selectedBlock.row || coords.col != selectedBlock.column)
            {
                console.log("over a dif block", coords);
                board.swapBlocks(selectedBlock, board.getBlock(coords.row, coords.col));
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

    function initBoard()
    {
        fillRandomBoard();
    }

    

    function startGame()
    {
        console.log("ran startGame()");
        if(window.resources.resourcesLoaded() == true)
        {
            tileImage = window.resources.images["tileImage"];
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
        //var row = Math.floor(mouse.y / TILE_HEIGHT);
        //var col = Math.floor(mouse.x / TILE_WIDTH);
        var pos = board.coordsToColRow(mouse);
        selectedBlock = board.getBlock(pos.row, pos.col);
        selectedBlock.select();
        console.log(selectedBlock);
    }

    function onMouseUp(e)
    {
        if (selectedBlock)
        {
            selectedBlock.unselect();
            selectedBlock = null;
        }
    }

    function initCanvas()
    {
        canvas.onmousedown = onMouseDown;
        window.onmouseup = onMouseUp;
        window.onmousemove = onMouseMove;

        canvas.width = TILE_WIDTH * board.numColumns;
        canvas.height = TILE_HEIGHT * board.numRows;
    }

    function init()
    {
        window.resources.loadResources();

        canvasInfo = this.canvasInfo;
        canvas = canvasInfo.canvas;
        ctx = canvasInfo.ctx;

        lastTime = this.lastTime;

        initCanvas();

        board.init();
        console.log(typeof (tileImage));
        startGame();
    }

    var game = { "init": init };
    window.puzzmatch = game;
})();