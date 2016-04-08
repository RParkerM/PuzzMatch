(function () {


    //this is everything that will go in the Input namespace
    function Input() {
        var _locked = false;


        var isLocked = function () {
            return _locked;
        };
        var Lock = function () {
            _locked = true;
        };
        var Unlock = function () {
            _locked = false;
        };
    }


    if (window.puzzmatch == null || typeof window.puzzmatch !== 'object') {
        window.puzzmatch = {};
    }
    puzzmatch.Input = new Input();
})();