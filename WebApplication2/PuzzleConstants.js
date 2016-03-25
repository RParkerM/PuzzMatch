(function () {
    var TILE_SELECT_SIZE_MOD = 1.3;

    var BOARD_HEIGHT = 5;
    var BOARD_WIDTH = 6;
    var TILE_HEIGHT = 40;
    var TILE_WIDTH = 40;

    var BLOCK_TYPES = 6;

    var Constants = { "TILE_SELECT_SIZE_MOD": TILE_SELECT_SIZE_MOD };
    Constants.BOARD_HEIGHT = BOARD_HEIGHT;
    Constants.BOARD_WIDTH = BOARD_WIDTH;
    Constants.TILE_HEIGHT = TILE_HEIGHT;
    Constants.TILE_WIDTH = TILE_WIDTH;
    Constants.BLOCK_TYPES = BLOCK_TYPES;

    if (window.puzzmatch == null || typeof window.puzzmatch !== 'object') {
        window.puzzmatch = {};
    }
    puzzmatch.Constants = Constants;
})();