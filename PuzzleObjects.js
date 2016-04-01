﻿(function () {

    var TILE_SELECT_SIZE_MOD = puzzmatch.Constants.TILE_SELECT_SIZE_MOD;

    function doChainsHaveDuplicates(sourceChain, targetChain) { //this checks to see if chains should merge
        var sourceArray = sourceChain.blocks();
        var targetArray = targetChain.blocks();
        return targetArray.some(function (v) {
            if (sourceArray.indexOf(v) >= 0){
                return true;
            } else if (sourceChain.blockType == targetChain.blockType) {
                return sourceChain.getBlock(v.row - 1, v.column) != undefined || sourceChain.getBlock(v.row + 1, v.column) != undefined
            } else {
                return false;
            }
        });
    }

    function secondsToMilliseconds(seconds){
        return seconds*1000;
    }

    function Board(boardHeight, boardWidth, tileHeight, tileWidth, numBlockColors) {

        var self = this;
        //private properties
        var tileWidth = tileWidth;
        var tileHeight = tileHeight;
        var tileImage;

        var numRows = boardHeight;
        var numColumns = boardWidth;

        var field = []; //contains the board state
        var matchAnimations = []; //contains array of matchAnimations


        ///Objects
        function block(type, column, row) {
            this.column = column;
            this.row = row;
            this.type = type;
            this.selected = false;

            this.clone = function () {
                return new block(this.type, this.column, this.row);
            };

            this.description = function () {
                return "Block type: " + this.type + " Position: " + this.row + "," + this.column + ".";
            };

            this.draw = function (context) {
                if (this.type == -1) return;
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

        function Chain() {
            var _blocks = [];
            this.blockType = -1; //color of blocks inside this chain

            this.isRow = false; //means it is a continous chain from the left side of the board to the right

            this.addBlock = function (block) {
                _blocks.push(block);
                this.blockType = block.type;
            };

            this.blocks = function () {
                return _blocks;
            };

            this.clear = function () {
                for (var i = 0; i < _blocks.length; i++) {
                    _blocks[i].type = -1;
                }
            };

            this.getBlock = function(row, column){
                for (var i = 0; i < _blocks.length; i++) {
                    if (_blocks[i].row == row && _blocks[i].column == column) {
                        return _blocks[i];
                    }
                }
                return undefined;
            }

            this.setBlocks = function (newBlocks) { // sets blocks but removes dupes
                _blocks = newBlocks.filter(function (v, i, arr) {
                    return i == arr.indexOf(v);
                });
                
            };

            this.length = function () {
                return _blocks.length;
            }
        } //chain object

        function matchAnimation(chain, timestart, duration) {
            if (duration == undefined) { duration = 250; }
            var blockType = chain.blockType;
            var animChain = [];
            var timestart = timestart;
            var duration = duration;

            for (var i = 0; i < chain.length(); i++){
                animChain.push(chain.blocks()[i].clone());
            }

            this.draw = function (ctx, time) {
                
                if (time < timestart + duration) {
                    //console.log("draw anim", (timestart-time+duration)/duration, duration);
                    ctx.save();
                    var alpha = Math.min((timestart-time+duration) / duration, 1);
                    ctx.globalAlpha = alpha;
                    for (var i = 0; i < animChain.length; i++) {
                        animChain[i].draw(ctx);
                    }
                    //console.log(animChain);
                    ctx.restore();
                }
            }

            this.animationComplete = function () { //something to check if the animation is complete, so we can remove it

            }
        }

        ///functions
        var findHorizontalMatches = function () {
            var horizontalMatches = [];
            for (var y = 0; y < numRows; y++) {
                for (var x = 0; x < numColumns - 2;) {
                    var blockType = self.getBlock(y, x).type;
                    if (self.getBlock(y, x + 1).type == blockType && self.getBlock(y, x + 2).type == blockType) {
                        var newChain = new Chain();
                        do {
                            newChain.addBlock(self.getBlock(y, x));
                            x += 1;
                        } while (x < numColumns && self.getBlock(y, x).type == blockType)
                        if (newChain.length() == numColumns)
                        {
                            newChain.isRow = true;
                        }
                        horizontalMatches.push(newChain);
                        continue;
                    }
                    x++;
                }
            }
            return horizontalMatches;
        };
        var findVerticalMatches = function () {
            var verticalMatches = [];
            for(var x = 0; x < numColumns; x++)
            {
                for(var y = 0; y < numRows - 2;)
                {
                    var blockType = self.getBlock(y, x).type;
                    if (self.getBlock(y + 1, x).type == blockType && self.getBlock(y + 2, x).type == blockType) {
                        var newChain = new Chain();
                        do {
                            newChain.addBlock(self.getBlock(y, x));
                            y += 1;
                        } while (y < numRows && self.getBlock(y, x).type == blockType)
                        verticalMatches.push(newChain);
                        continue;
                    }
                    y++;
                }
            }
            return verticalMatches; 
        };

        var shuffle = function () {
            //console.log("this.numRows:", numRows, "this.numColumns", numColumns, "this:", self);
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

        ///public properties

        this.numRows = boardHeight;
        this.numColumns = boardWidth;
        this.init = function (tileSpriteSheet) {
            tileImage = tileSpriteSheet;
            field.length = this.numRows * this.numColumns;
            shuffle();
        };

        this.getHeight = function () {
            return this.numRows * tileHeight;
        };
        this.getWidth = function () {
            return this.numColumns * tileWidth;
        };

        this.draw = function (context) {
            context.fillStyle = "#000";
            context.fillRect(0, 0, this.numColumns * tileWidth, this.numRows * tileHeight);
            var now = Date.now();
            for (var i = 0; i < field.length; i++) {

                field[i].draw(context);
            }
            for(var i = 0; i < matchAnimations.length; i++){
                matchAnimations[i].draw(context, now);
            }
        };

        this.getBlock = function (row, column) { //expects row and column, returns the block or null
            if (column >= 0 && column < this.numColumns && row >= 0 && row >= 0 && row < this.numRows) {
                return field[row * this.numColumns + column];
            }
            //console.log("Row, column:", row, column, "=null");
            return null;
        };
        this.setBlock = function (row, column, block) {
            if (column >= 0 && column < this.numColumns && row >= 0 && row < this.numRows) {
                field[row * this.numColumns + column] = block;
            }
        };
        this.swapBlocks = function (block1, block2) {
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
            var chains = findHorizontalMatches();
            chains = chains.concat(findVerticalMatches());
            chains = chains.filter(function (v, i, arr) {
                if(i >= arr.length -1){
                    return true;
                }
                for (j = i+1; j < arr.length; j++) {
                    if(doChainsHaveDuplicates(v, arr[j]))
                    {
                        //console.log("arrays have dupes...?")
                        arr[j].setBlocks((arr[j].blocks().concat(v.blocks())));
                        arr[j].isRow = arr[j].isRow || v.isRow;
                        return false;
                    }
                }
                return true;
                
            });  //this just combines the chains. kinda of hacky, TODO fix this
            for (i = 0; i < chains.length; i++)
            {
                var str = "is not a row";
                if (chains[i].isRow) str = "is a row";
                console.log("Chain[", i, "]:", chains[i].blocks(), str);
                matchAnimations.push(new matchAnimation(chains[i],Date.now()+i*250));
                chains[i].clear();
            }
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