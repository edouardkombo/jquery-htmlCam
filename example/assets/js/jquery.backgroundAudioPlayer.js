/*
 * jQuery backgroundAudioPlayer
 * Version 0.1 (@edouardkombo / breezeframework.com)
 * https://github.com/edouardkombo/jquery-backgroundAudioPlayer
 *
 * Html5 background audio player
 *
 * Copyright (c) 2014 Edouard Kombo (@edouardkombo / breezeframework.com)
 * Dual licensed under the MIT and GPL licenses.
*/

(function($){
    $.backgroundAudioPlayer = function (sound, settings){
        
        //Configs
        var config = {
            stop: false
        };
        
        if (settings) {
            $.extend(config, settings);
        }        
        
        //Variables
        var snd = '';
        var extensions = ['ogg', 'mp3', 'wav', 'mp4', 'wma'];
        var fileExtension = sound.split('.').pop();
        
        
        if (window.HTMLAudioElement) {
            snd = new Audio('');

            if ($.inArray(fileExtension, extensions) !== -1) {
                if (snd.canPlayType('audio/' + fileExtension + '')) {
                    snd = new Audio(sound);

                    snd.play();
                    console.log(snd);

                    if (config.stop === true) {
                        console.log(snd.stop());
                    }
                    
                } else {
                   alert('Error! Unable to play ' + sound + '. Please check extension.'); 
                }
                
            } else {
                alert('Your file format is not recognied as audio files!');
            }
            
        } else {
            alert('HTML5 Audio is not supported by your browser!');
        }
        
        return this;
    };
})(jQuery);
