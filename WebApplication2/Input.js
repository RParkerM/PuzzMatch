(function () {


    //this is everything that will go in the Input namespace
    function Input() {
        var locked = false;


        this.isLocked = function () {
            return locked;
        };
        this.Lock = function () {
            //console.log("locking input");
            locked = true;
        };
        this.Unlock = function () {
           // console.log("unlocking input");
            locked = false;
        };
    }


    if (window.puzzmatch == null || typeof window.puzzmatch !== 'object') {
        window.puzzmatch = {};
    }
    puzzmatch.Input = new Input();
})();