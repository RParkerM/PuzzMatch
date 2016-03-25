(function () {

    var TILE_SELECT_SIZE_MOD = puzzmatch.constants.TILE_SELECT_SIZE_MOD;

    function Board(boardHeight, boardWidth, tileHeight, tileWidth, numBlockColors) {

        var self = this;
        //private properties
        var tileWidth = tileWidth;
        var tileHeight = tileHeight;
        var tileImage;

        var numRows = boardHeight;
        var numColumns = boardWidth;

        var field = {}; //contains the board state

        function block(type, column, row) {
            this.column = column;
            this.row = row;
            this.type = type;
            this.selected = false;

            this.description = function () {
                return "Block type: " + this.type + " Position: " + this.row + "," + this.column + ".";
            };

            this.draw = function (context) {
                context.save();
                if (this.selected == true) context.globalAlpha = 0.5;
                context.drawImage(tileImage, this.type * tileWidth, 0, tileWidth, tileHeight, this.column * tileWidth, this.row * tileHeight, tileWidth, tileHeight);
                //format is ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                context.restore();
            };

            this.drawSelected = function (context, x, y) { //function to draw a block that's been selected, at x and y
                context.save();
                context.globalAlpha = 0.8;
                context.drawImage(tileImage, this.type * tileWidth, 0, tileWidth, tileHeight, x - tileWidth * TILE_SELECT_SIZE_MOD / 2, y - tileHeight * TILE_SELECT_SIZE_MOD / 2, tileWidth * TILE_SELECT_SIZE_MOD, tileHeight * TILE_SELECT_SIZE_MOD);
                context.restore();
            };

            this.select = function () {
                this.selected = true;
            };

            this.unselect = function () {
                this.selected = false;
            };
        }

        function chain() {
            var _blocks = [];
            this.addBlock = function (block) {
                _blocks.push(block);
            };
            this.blocks = function () {
                return _blocks;
            };
        };

        var findHorizontalMatches = function () {
            var horizontalMatches = [];
            for (var y = 0; y < numColumns; y++) {
                for (var x = 0; x < numRows; x++) {

                }
            }
        };

        var shuffle = function () {
            console.log("this.numRows:", numRows, "this.numColumns", numColumns, "this:", self);
            for (var y = 0; y < numRows; y++) {
                for (var x = 0; x < numColumns; x++) {
                    do {
                        var blockType = Math.floor(Math.random() * numBlockColors);
                    } while ((x >= 2 && blockType == field[y * numColumns + x - 1] && blockType == field[y * numColumns + x - 2])
                        || (y >= 2 && blockType == field[(y - 1) * numColumns + x] && blockType == field[(y - 2) * numColumns + x]));
                    field[y * numColumns + x] = new block((blockType), x, y);
                    //console.log(field[y * numColumns + x], "field");
                }
            }
        };

        //public properties
        this.numRows = boardHeight;
        this.numColumns = boardWidth;
        this.init = function (tileSpriteSheet) {
            tileImage = tileSpriteSheet;
            field.length = this.numRows * this.numColumns;
            shuffle();
        };

        this.draw = function (context) {
            context.fillStyle = "#000";
            context.fillRect(0, 0, this.numColumns * tileWidth, this.numRows * tileHeight);
            for (var i = 0; i < field.length; i++) {

                field[i].draw(context);
                //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        };

        this.getBlock = function (row, column) { //expects row and column, returns the block or null
            if (column >= 0 && column < this.numColumns && row >= 0 && row >= 0 && row < this.numRows) {
                return field[row * this.numColumns + column];
            }
            console.log("Row, column:", row, column, "=null");
            return null;
        };
        this.setBlock = function (row, column, block) {
            if (column >= 0 && column < this.numColumns && row >= 0 && row < this.numRows) {
                field[row * this.numColumns + column] = block;
            }
        };

        this.swapBlocks = function (block1, block2) {
            console.log("block1:", block1, "block2:", block2);
            var tempRow = block1.row;
            var tempCol = block1.column;
            block1.row = block2.row;
            block1.column = block2.column;
            block2.row = tempRow;
            block2.column = tempCol;

            this.setBlock(block1.row, block1.column, block1);
            this.setBlock(block2.row, block2.column, block2);
        };

        this.solveBoard = function () {

        };

        this.mouseToBlockCoords = function (coords) { // Expects x and y properties. Returns object with row and column properties
            var col = Math.floor(coords.x / tileWidth);
            var row = Math.floor(coords.y / tileHeight);
            if (row < 0) {
                row = 0;
            }
            else if (row >= this.numRows) {
                row = this.numRows - 1;
            }
            if (col < 0) {
                col = 0;
            }
            else if (col >= this.numColumns) {
                col = this.numColumns - 1;
            }
            return { "row": row, "column": col };
        };
    }



    var Objects = { "Board": Board };

    if (window.puzzmatch == null || typeof window.puzzmatch !== 'object') {
        window.puzzmatch = {};
    }
    window.puzzmatch.Objects = Objects;


})();