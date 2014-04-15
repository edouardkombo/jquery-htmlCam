<?php
$newUrl = (strlen($_SERVER['REQUEST_URI']) > 1) ? '../' : '' ;
?>

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
    <base href="http://<?php echo $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . $newUrl; ?>">
    <link async href="assets/css/style_responsive.css" rel="stylesheet">
    <script src="assets/js/jquery-2.1.0.min.js"></script> 
    <script src="assets/js/whammy.js"></script>    
    <script src="assets/js/jquery.htmlCam.js"></script>
    <script>
        $(document).ready(function(){

            var filename    = 26;
            var path        = '../medias/';
            var audioFormat = '.wav';
            var videoFormat = '.webm';            

            $.htmlCam({
                startCam: true,
                recordingTime: 10,
                recordAudioAndVideo: true,
                enableAudioStream: true,
                recorderWorkerPath: 'assets/js/recorderWorker.js',
                audioTriggerButtons: ['#ra','#sra'],
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
                    client.open("post", 'example/classes/mediaUpload.php?'+datas, true);
                    client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    client.setRequestHeader("X-File-Name", encodeURIComponent(filename));
                    client.setRequestHeader("Content-Type", "application/octet-stream");
                    client.send(media);                        
                },
                enableVideoStream: true,
                videoTriggerButtons: ['#rv','#srv'],
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
                    client.open("post", 'example/classes/mediaUpload.php?'+datas, true);
                    client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    client.setRequestHeader("X-File-Name", encodeURIComponent(filename));
                    client.setRequestHeader("Content-Type", "application/octet-stream");
                    client.send(media);                      
                },
                encode: function (){
                    
                    var _ffmpegPath      = '../assets/ffmpeg/bin/ffmpeg';
                    var _audioFilePath   = path + filename + audioFormat;
                    var _videoFilePath   = path + filename + videoFormat;
                    var _outputPath      = path + 'media' + videoFormat;
                    var _sleep           = 2;
                    
                    $.post('classes/mediaUpload.php',{
                        ffmpegPath: _ffmpegPath, 
                        audioFilePath: _audioFilePath, 
                        videoFilePath: _videoFilePath,
                        outputPath: _outputPath,
                        sleep: _sleep,
                        deleteOld: true
                    }, function(datas){
                        console.log(datas);
                    });                     
                }                
            });

        });
        //
    </script>
 </head>
<body> 
    <div id='test' style='position:absolute;top:0;color:#000000;'>
        <video id='vid' style='position:absolute;left:50%;' autoplay></video>
        <canvas id='canvas' ></canvas>
        
        <div id='buttons'>
            <div id='ra'>Record audio</div><br/>
            <div id='sra'>Stop Record audio</div><br/><br/>
            <div id='rv'>Record video</div><br/>
            <div id='srv'>Stop Record video</div>        
        </div>        
    </div>
    <div id='testEnd' style='position:absolute;top:0;left:30%;'></div>
    
    <div id='content'>
        
          
    </div>
    
    <!-- HERE IS THE CODE FOR EXPERIENCE -->
    <!--
    <div id="container">
        
        <div id='counter'></div>
        <div id='up'></div>

        <div id='hello_screen'>
            <h1></h1>
            <div id='hmiddle'>
                <span id='left_arrow'></span>
                <div></div>
                <span id='right_arrow'></span>            
            </div>
            <div id='hlow_middle'></div>
            <div id='hbottom'></div>    
        </div>

        <div id='whois_screen'>
            <div id='opacityFilm'></div>    
            <h2></h2>
            <div id='formDiv'>
                <div id='formBefore'>
                    <form id="producerForm" autocomplete="off" method="post" action="#" novalidate="novalidate">
                        <label for="civility" id='civilityLabel'></label>
                        <input type="radio" id='civility' name='civility' value='0' checked><span id='civility0'></span>
                        <input type="radio" id='civility' name='civility' value='1'><span id='civility1'></span>
                        <input type="radio" id='civility' name='civility' value='2'><span id='civility2'></span>
                        <br/>
                        <label for="name" class="add-on" id='nameLabel'></label>
                        <input type="text" id="name" name='name' value=''><br/>
                        <label for="firstname" id='firstnameLabel'></label>
                        <input type="text" id="firstname" name='firstname' value=''><br/>
                        <label for="email" id='emailLabel'></label>
                        <input type="email" id="email" name='email' value=''><br/>

                        <label for="newsletter">
                                <input type="checkbox" id="newsletter" name='newsletter' value='1' checked>
                                <span></span>
                        </label><br/>
                        <textarea disabled></textarea><br/>
                    </form>
                    <button id="btn_submit" class="btn btn-primary btn-lg">Enregistrer</button>
                    <div class='error'></div>
                    <div class='success'></div>
                </div>
            </div>
        </div>

        <div id='experience_screen'>
            <h2></h2>
        </div>

        <div id='end_screen'>
            <h3></h3>
            <div id='middle'>
                <span id='left_arrow'></span>
                <div></div> 
                <span id='right_arrow'></span>            
            </div>
            <div id='low_middle'>          
                <div></div>    
            </div>
            <div id='bottom'></div>      
        </div>

        <div id='actions_screen'>
            <div id='polaroid'>
                <span id='imgToFilter'></span>
                <p></p>                
            </div>
            <div id='allFilters'>
                <div class='filter' id="defaultFilter">Défaut</div>            
                <div class='filter' id="vintage">Vintage</div>
                <div class='filter' id="sepia">Sépia</div>
                <div class='filter' id="greenish">Greenish</div>
                <div class='filter' id="reddish">Reddish</div>
            </div>
        </div>

        <div id='actions'>
            <span id='take_snapshot'></span>
            <span id='take_replayExperience'></span>
            <span id='valid'></span>
        </div>    
    </div>
    
    <footer></footer>    
    

    -->
 
</body>
</html>