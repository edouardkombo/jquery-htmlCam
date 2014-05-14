<!doctype html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>MonaLisa</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="description" content="" />
    <meta name="keywords" content=""/>
    <meta name="revisit-after" content="1 days" />
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />
    <base href="http://<?php echo $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']; ?>">
 </head>
<body> 
    
        <div id='notice'>
            For high performance reasons you must always disable video rendering while recording.<br/>
            jQuery-htmlCam will automatically disable video rendering when the record will start.<br/><br/>
            <div id='start'>Click here to start recording</div><br/>
            <div id='stop'>Click here to stop recording</div>
        </div>      
  
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script>
            window.jQuery || document.write('<script src="jquery-1.10.2.min.js"><\/script>');
        </script>
        <script src="js/recorder.js"></script>
        <script src="js/recorderWorker.js"></script>    
        <script src="js/whammy.js"></script>    
        <script src="js/jquery.htmlCam.js"></script>        
        <script>
            
            $('#start').click(function(){
                $('canvas').click();
            });            
            
            var rafd   = '';
            
            /**
             * Create video div
             * 
             * @param {string} div
             * @param {string} stream
             * @param {boolean} show
             * @returns {unresolved}
             */
            function createVideoDiv(div, stream, show)
            {
                var element     = document.getElementById(div);

                if (element === null) {   
                    var video       = document.createElement(div);
                    video.id        = div;
                    video.autoplay  = true;
                    if (show === false) {
                        video.style.display    = 'none';
                    }
                    if (stream !== '') {
                        video.src   = window.URL.createObjectURL(stream);        
                    }
                    return document.getElementsByTagName('body')[0].appendChild(video);        
                }    

                return false;
            }            
            
            
            //HtmlCam plugin
            $.htmlCam({
                startCam: true,
                recorder: Recorder,
                recordingTime: 30,
                hideVideoOnStart: false,
                onAudioComplete: function (media)  {

                    var datas       = 'path=medias'+'&format=.wav';                  

                    //Because with classic ajax requests we are unable to send huge files
                    //We use original XMLHttpRequest object
                    var client = new XMLHttpRequest();
                    client.onreadystatechange = function() 
                    {
                        if (client.readyState === 4 && client.status === 200) 
                        {
                            console.log(client.response);                        
                        }
                    };
                    client.open("post", 'classes/mediaUpload.php?'+datas, true);
                    client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    client.setRequestHeader("X-File-Name", encodeURIComponent('1'));
                    client.setRequestHeader("Content-Type", "application/octet-stream");
                    client.send(media.content);                        
                },
                enableRecord: true,
                videoTriggerButtons: ['canvas', '#stop'],
                onVideoComplete: function (media)  {

                    var datas       = 'path=medias'+'&format=.webm';                  

                    //Because with classic ajax requests we are unable to send huge files
                    //We use original XMLHttpRequest object
                    var client = new XMLHttpRequest();
                    client.onreadystatechange = function() 
                    {
                        if (client.readyState === 4 && client.status === 200) 
                        {
                            console.log(client.response);

                            $.post('classes/mediaUpload.php',{
                                path: 'medias/', 
                                audioFormat: '.wav',
                                videoFormat: '.webm',
                                finalFormat: '.mp4',
                                deleteOld: 0
                            }, function(datas){
                                //Show final video
                                cancelAnimationFrame(rafd);

                                //Recreate video div for a new use
                                createVideoDiv('video', media.stream, false);

                                showFinalMedia(datas,'video');

                                console.log('video recreated!');
                            });                 
                        }
                    };                    
                    client.open("post", 'classes/mediaUpload.php?'+datas, true);
                    client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    client.setRequestHeader("X-File-Name", encodeURIComponent('1'));
                    client.setRequestHeader("Content-Type", "application/octet-stream");
                    client.send(media.content);                      
                }                
            });            

        </script>        
        
</body>
</html>