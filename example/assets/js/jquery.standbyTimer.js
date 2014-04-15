/*
 * jQuery standbyTimer
 * Version 0.1 (@edouardkombo / breezeframework.com)
 * https://github.com/edouardkombo/jquery-standbyTimer
 *
 * Initialize a timer that starts by clicking on an element of the page.
 * If a click has been detected before the end of the timer, timer is increased.
 * Timer is resetted if no click has been detected before its end.
 *
 * Copyright (c) 2014 Edouard Kombo (@edouardkombo / breezeframework.com)
 * Dual licensed under the MIT and GPL licenses.
*/

(function($){
    $.standbyTimer = function (selector, settings){
        //Settings
        var config = {
            timer: 120,        //Timer in seconds
            interval: 1000,    //Timer interval
            onComplete: null, //Execute a method
            stop: false,       //Stop the timer at the end of the period
            debug: false
        };       
        
        if (settings) {
            $.extend(config, settings);
        }
        
        //variables
        ghostTimer  = 0;
        clickOnSelector  = 0;                

        //Run
        var restart = setInterval( function() 
        {
            //Increase the ghost Timer
            if(ghostTimer > 0) {
                ++ghostTimer;
            }
            
            //Reset application if a click has been detected
            if ((ghostTimer >= config.timer)) {
                ghostTimer = 1;
                
                //Stop the timer
                if (config.stop === true) {
                    clearInterval(restart);
                }                
                
                if (clickOnSelector === 1) {
                    
                    clickOnSelector  = 0;                    
                    
                    //Do optional actions
                    if ($.isFunction(config.onComplete)) {
                        config.onComplete.call(this);
                    }

                }
            }
            
            //Detect a click on selector
            $(selector).click(function(){
                if (clickOnSelector === 0) {
                    clickOnSelector = 1;
                    
                    ghostTimer = 1;
                }
            });
            
            //Show debug in console
            if (config.debug === true) {
                console.log('Timer:' + ghostTimer + ' // ClickOnPage:' + clickOnSelector );
            }            
            
        }, config.interval);
        
        return this;
    };
    
})(jQuery);
