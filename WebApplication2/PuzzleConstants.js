(function () {
    var TILE_SELECT_SIZE_MOD = 1.3;

    var constants = {"TILE_SELECT_SIZE_MOD": TILE_SELECT_SIZE_MOD};
    if (window.puzzmatch == null || typeof window.puzzmatch !== 'object') {
        window.puzzmatch = {};
    }
    puzzmatch.constants = constants;
})();