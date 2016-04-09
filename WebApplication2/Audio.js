(function () {


    //this is everything that will go in the Audio namespace
    function AudioManager() {
        var volume = 100;
        var streams = 10;
        var sounds = [];
        var comboSounds = [];
        var soundIterator = 0;
        var comboSoundIterator = 0;
        var queuedComboSounds = [];

        this.changeVolume = function (newVolume) {
            volume = Math.min(Math.max(0, newVolume));
        };

        this.playSound = function (soundName) {
            sounds[soundIterator].volume = volume / 100;
            //console.log(sounds[soundIterator].volume);
            sounds[soundIterator++].play();
            if (soundIterator >= streams) { soundIterator = 0; }
            //sound.play();
        };
        function init() {
            for (var i = 0; i < streams; i++) {
                sounds[i] = new Audio("newclick.mp3");
            }
            for (var i = 0; i < 15; i++) {
                var num = Math.min(i,7) + 1;
                comboSounds[i] = new Audio("Sounds//new" + num.toString() + ".mp3");
                //console.log(comboSounds[i]);
            }
        }
        this.playComboSound = function () {
            var num = comboSoundIterator++;
            if(num > 7){
                num = (num%7)+7
            }
            comboSounds[num].volume = volume / 100;
            comboSounds[num].play();
            //console.log(num);
        };
        this.queueComboSound = function (time) {
            queuedComboSounds.push(time);
        }
        this.resetCombo = function () {
            comboSoundIterator = 0;
        };
        this.update = function (now) {
            if (queuedComboSounds.length > 0) {
                if (now > queuedComboSounds[0]) {
                    this.playComboSound();
                    queuedComboSounds.shift();
                }
            }
        };
        init();
    }


    if (window.puzzmatch == null || typeof window.puzzmatch !== 'object') {
        window.puzzmatch = {};
    }
    puzzmatch.AudioManager = new AudioManager();
})();