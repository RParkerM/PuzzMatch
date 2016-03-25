(function () {

    function block(type, column, row) {
        this.column = column;
        this.row = row;
        this.type = type;
        this.selected = false;

        this.description = function () {
            return "Block type: " + this.type + " Position: " + this.row + "," + this.column + ".";
        };

        this.draw = function (context) { //relies on ctx, tileImage, TILE_WIDTH, TILE_HEIGHT
            context.save();
            if (this.selected == true) context.globalAlpha = 0.5;
            context.drawImage(tileImage, this.type * TILE_WIDTH, 0, TILE_WIDTH, TILE_HEIGHT, this.column * TILE_WIDTH, this.row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            //format is ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            context.restore();
        };

        this.select = function () {
            this.selected = true;
        };

        this.unselect = function () {
            this.selected = false;
        };
    };

    if (window.puzzmatch == null || typeof window.puzzmatch !== 'object') {
        window.puzzmatch = {};
    }


})();