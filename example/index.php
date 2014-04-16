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
    <script src="assets/js/jquery-2.1.0.min.js"></script> 
    <script src="assets/js/whammy.js"></script>    
    <script src="assets/js/jquery.htmlCam.js"></script>
    <script>
        $(document).ready(function(){

            var filename        = 26;
            var path            = '../medias/';
            var pictureFormat   = '.jpeg';            
            var audioFormat     = '.wav';
            var videoFormat     = '.webm';            

            $.htmlCam({
                startCam: true,
                pictureQuality: 1.0,
                enableSnapshot: true,
                snapshotButton: '#snapshot',
                snapshotSound: 'shot.wav',
                snapShotFormat: 'jpeg',
                snapshotFlashScreen : {fadeIn: 1000, fadeInSpeed: 0.1, fadeOut: 1000, fadeOutSpeed: 1.0},
                snapshotOnComplete: function(media){
                    
                    var datas       = 'filename='+filename+'&path='+path+'&format='+pictureFormat;                  
                    
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
                    client.setRequestHeader("X-File-Name", encodeURIComponent(filename));
                    client.setRequestHeader("Content-Type", "application/octet-stream");
                    client.send(media);                    
                },
                recordingTime: 60,
                recordAudioAndVideo: true,                
                enableAudioStream: true,
                recorderWorkerPath: 'assets/js/recorderWorker.js',
                audioTriggerButtons: ['#record_audio','#stop_record_audio'],
                onAudioComplete: function (media)  {
                    
                    var datas       = 'filename='+filename+'&path='+path+'&format='+audioFormat;                  
                    
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
                    client.setRequestHeader("X-File-Name", encodeURIComponent(filename));
                    client.setRequestHeader("Content-Type", "application/octet-stream");
                    client.send(media);                        
                },
                enableVideoStream: true,
                videoFrameRate: 500/60,
                videoTriggerButtons: ['#record_video','#stop_record_video'],
                onVideoComplete: function (media)  {
                    
                    var datas       = 'filename='+filename+'&path='+path+'&format='+videoFormat;                  
                    
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
                    client.setRequestHeader("X-File-Name", encodeURIComponent(filename));
                    client.setRequestHeader("Content-Type", "application/octet-stream");
                    client.send(media);                      
                },
                encode: function (){
                    
                    var _encoderEnvironmentPath      = 'ffmpeg';
                    var _audioFilePath   = path + filename + audioFormat;
                    var _videoFilePath   = path + filename + videoFormat;
                    var _outputPath      = path + 'media' + videoFormat;
                    var _sleep           = 2;
                    
                    $.post('classes/mediaUpload.php',{
                        encoderEnvPath: _encoderEnvironmentPath, 
                        audioFilePath: _audioFilePath, 
                        videoFilePath: _videoFilePath,
                        outputPath: _outputPath,
                        sleep: _sleep,
                        deleteOld: 0
                    }, function(datas){
                        console.log(datas);
                        $('body').show();
                        $('video').show();
                    });                     
                }                
            });

        });
        //
    </script>
 </head>
<body> 
    <div id='test' style='position:relative;top:0;color:#000000;'>
        <video id='vid' style='position:relative;text-align: center;' autoplay></video>
        <canvas id='canvas' style='visibility:hidden;'></canvas>
        
        <div id='buttons'>
            <div><button id='snapshot'>Take picture</button></div><br/>
            <div><button id='record_audio'>Record audio</button></div><br/>
            <div><button id='stop_record_audio'>Stop Record audio</button></div><br/>
            <div><button id='record_video'>Record video</button></div><br/>
            <div><button id='stop_record_video'>Stop Record video</button></div>        
        </div>        
    </div>
    <div id='testEnd' style='position:absolute;top:0;left:30%;'></div>
    
    <div id='content'></div>
 
</body>
</html>