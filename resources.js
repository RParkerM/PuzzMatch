(function () {
    
    var images = [];
    var resourcesLoaded = false;

    function doneLoading() {
        return resourcesLoaded;
    }

    function loadResources() {
        var tileImage = new Image();
        tileImage.onload = function () {
            resourcesLoaded = true;
            console.log("loaded!");
        }
        tileImage.src = "match3_tiles_px.png";
        images["tileImage"] = tileImage;
    }

    window.resources = {
        loadResources: loadResources,
        resourcesLoaded: doneLoading,
        images: images
    };
})();