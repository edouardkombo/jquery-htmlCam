/*
 * jQuery html2Picture
 * Version 0.1 (@edouardkombo / breezeframework.com)
 * https://github.com/edouardkombo/jquery-html2Picture
 *
 * Capture img and videos in html dom with javascript.
 *
 * Copyright (c) 2014 Edouard Kombo (@edouardkombo / breezeframework.com)
 * Dual licensed under the MIT and GPL licenses.
*/
(function($){
    $.fn.html2Picture = function (settings){
        
        //Settings
        var config = {
            type: 'photo',
            pictureName: $.now(),
            pictureFormat: 'jpeg',
            showCanvas: false,
            width: '',         //Width of the selector
            height: '',        //Height of the selector
            quality: 0.0,
            callback: 'null'
        };       
        
        if (settings) {
            $.extend(config, settings);
        }
        
        this.each(function(){
            
            //Variables
            var element = $(this);
            var allowedFormats = ['jpeg','jpg','png','gif'];
            
            //Source definition
            var source = $(element);
            
            //Canvas definition
            var canvas = ($('canvas').length > 0) ? $("canvas") : $('<canvas>').attr({id: 'canvas'}).appendTo("body");
            var ctx = canvas[0].getContext('2d');        
            
            //Media definition
            var img    = new Image();
            img.src    = (config.type === 'photo') ? source.attr('src') : '';

            var result = '';
            
            
            /* Functions */
            //Create picture from media
            function createPictureFromMedia()
            {
                if (config.type !== 'video') {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);                        
                } else {
                    ctx.drawImage(source[0], 0, 0, canvas.width, canvas.height);                        
                }
                
                result = canvas[0].toDataURL('image/'+config.pictureFormat, config.quality);

                //Callback function with parameters
                if ($.isFunction(config.callback)) {
                    config.callback.call(this, {url: result, name: config.pictureName, extension: config.pictureFormat, fullPictureName: config.pictureName+'.'+config.pictureFormat});
                }                
            }
            
            /*
             * TODO: Snapshot of siv elements
            //Create picture from html
            function createPictureFromHtml()
            {
                var myData = source[0].innerHTML;
                
                 var data = "data:image/svg+xml,"+"<svg xmlns='http://www.w3.org/2000/svg' width='"+ source.width() +"' height='"+ source.height() +"'>" +
                     "<foreignObject width='100%' height='100%' requiredExtensions='http://example.com/SVGExtensions/EmbeddedXHTML'>" +
                        "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:40px'>" +
                            "<em>I</em> like <span style='color:white; text-shadow:0 0 2px blue;'>cheese</span>" +
                        "</div>" +
                     "</foreignObject>" +
                   "</svg>"
                ;               
 
                //img.src = uri;                    

                img.src = data;

                img.onload = function () {
                    ctx.drawWindow(window, 0, 0, canvas.width, canvas.height);

                    result = canvas[0].toDataURL('image/'+config.pictureFormat, config.quality);

                    //Callback function with parameters
                    if ($.isFunction(config.callback)) {
                        config.callback.call(this, {url: result, name: config.pictureName, extension: config.pictureFormat, fullPictureName: config.pictureName+'.'+config.pictureFormat});
                    }                    
                }
            }*/            
            
            
            if ($.inArray(config.pictureFormat, allowedFormats) !== -1) {
                
                //Only allow "jpeg" formats, not "jpg"
                config.pictureFormat = (config.pictureFormat === 'jpg') ? 'jpeg' : config.pictureFormat ;
                
                //Uniform size
                if ((config.width === '') && (config.height === '')) {                   
                    $('canvas').attr({width: source.width(), height: source.height()});
                    canvas.width = source.width();
                    canvas.height = source.height();                    
                } else {
                    source.css('width', config.width);
                    source.css('height', config.height);
                    
                    $('canvas').attr({width: config.width, height: config.height});
                    canvas.width = config.width;
                    canvas.height = config.height;                    
                }

                //Create picture and return result
                if (img.src === window.location.href) {
                    if (config.type === 'html') {
                        //createPictureFromHtml();
                    } else {
                        createPictureFromMedia();
                    }
                } else {
                    img.onload= function(){
                        createPictureFromMedia();
                    }                   
                }
                
                if (config.showCanvas === true) {
                    $('canvas').show();
                }
    
            } else {
               alert('File "'+config.pictureFormat+'" chosen for html2picture is not valid!'); 
            }                          
        });
        
        return this;
    };
    
})(jQuery);
