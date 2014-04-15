/*
 * jQuery flashScreen
 * Version 0.1 (@edouardkombo / breezeframework.com)
 * https://github.com/edouardkombo/jquery-flashScreen
 *
 * Custom flash screen effect with jQuery.
 *
 * Copyright (c) 2014 Edouard Kombo (@edouardkombo / breezeframework.com)
 * Dual licensed under the MIT and GPL licenses.
*/
(function($){
    $.fn.flashScreen = function (settings){
        
        //Settings
        var config = {
            fadeIn: 1000,
            fadeInSpeed: 0.1,
            fadeOut: 1000,
            fadeOutSpeed: 1.0,
        };       
        
        if (settings) {
            $.extend(config, settings);
        }
        
        this.each(function(){
            
            var element = $(this);

            $(element).fadeTo(config.fadeIn, config.fadeInSpeed).fadeTo(config.fadeOut, config.fadeOutSpeed);                 
        });
        
        return this;
    };
    
})(jQuery);
