/*
 * jQuery htmlCam
 * Version 0.1 (@edouardkombo / breezeframework.com)
 * https://github.com/edouardkombo/jquery-htmlCam
 *
 * Activate webcam, record audio and videos directly and encode them in html5 and javascript, no flash.
 *
 * Copyright (c) 2014 Edouard Kombo (@edouardkombo / breezeframework.com)
 * Dual licensed under the MIT and GPL licenses.
*/
(function($){

    $.htmlCam = function (settings) {
        
        //Config
        var config = {
            startCam: true,
            pictureQuality: 1.0,
            enableSnapshot: false,
            snapshotFlashScreen: false,
            snapshotButton: '',
            snapshotSound: '',
            snapShotFormat: 'jpeg',            
            snapshotOnComplete: '',
            recordingTime: 0,
            recordAudioAndVideo: false, //If true, both recording is done by video
            enableVideoStream: false,
            enableAudioStream: false,
            recorderWorkerPath: '',
            onAudioComplete: 'null',
            audioTriggerButtons: '',           
            onVideoComplete: 'null',
            videoTriggerButtons: '',
            videoFrameRate: 500/60,
            encode: ''          
        };       
        
        if (settings) {
            $.extend(config, settings);
        }
        
        var video               = ($('video').length > 0) ? $("video") : $('<video>').attr({id: 'video'}).appendTo("body");
        video.autoplay          = true; //Make sure we are not frozen     
        
        config.recordingTime    = config.recordingTime * 1000;
        
        var snd                 = '';
        var audioExtensions     = ['ogg', 'mp3', 'wav', 'mp4', 'wma'];
        var audioFileExtension  = (config.snapshotSound !== '') ? config.snapshotSound.split('.').pop() : '';        
        
        var canvas              = ($('canvas').length > 0) ? $("canvas") : $('<canvas>').attr({id: 'canvas'}).appendTo("body");
        var ctx                 = canvas[0].getContext('2d');
        var localMediaStream    = null;
        
        var audio_context;
        var audio               = ($('audio').length > 0) ? $("audio") : $('<audio>').attr({id: 'audio'}).appendTo("body");
        var recorder;
        var localStream;
        
        var ORIGINAL_DOC_TITLE  = document.title;
        var rafId               = null;
        var startTime           = null;
        var endTime             = null;
        var frames              = [];
        
        $('canvas').attr({width: video.width(), height: video.height()});        
        
        if (config.recordAudioAndVideo === true) {
            config.enableAudioStream = true;
            config.enableVideoStream = true;
        }
        
        
        /* Define buttons for audio, record and snapshot */

            if (config.enableSnapshot) {
                
                $(config.snapshotButton).click(function(){

                    $(config.snapshotButton).hide();
                    $(config.audioTriggerButtons[0]).hide();
                    $(config.audioTriggerButtons[1]).hide();
                    $(config.videoTriggerButtons[0]).hide();
                    $(config.videoTriggerButtons[1]).hide();                    

                    takeSnapshot();
                    
                    $(config.snapshotButton).show();
                    if (config.recordAudioAndVideo) {
                        $(config.videoTriggerButtons[0]).hide();                        
                    } else {
                        $(config.audioTriggerButtons[0]).show(); 
                                                 
                    }
                     $(config.videoTriggerButtons[0]).show();
                   
                });                
            }        
        
            if (config.enableAudioStream) {
                if ($.isArray(config.audioTriggerButtons) === true) {
                    
                    //If audio and video recording enable, we don't need audio buttons
                    if (config.recordAudioAndVideo === true) {
                        $(config.audioTriggerButtons[0]).hide();
                        $(config.audioTriggerButtons[1]).hide();
                    } else {
                        $(config.audioTriggerButtons[0]).show();
                        $(config.audioTriggerButtons[1]).hide();
                    }                     

                    $(config.audioTriggerButtons[0]).click(function(){
                        
                        //If recordingTime is set up
                        if (config.recordingTime > 0) {
                            
                            startRecordingAudio();
                            $(config.audioTriggerButtons[0]).hide();
                            
                            //Define a timer to end record(s)
                            var recordTimer = setInterval( function(){
                                
                                stopRecordingAudio();
                                clearInterval(recordTimer);
                                
                                //Show record button again
                                $(config.audioTriggerButtons[0]).show();
                                
                            }, config.recordingTime);
                        
                        } else {
                            startRecordingAudio();
                            $(config.audioTriggerButtons[0]).hide();
                            $(config.audioTriggerButtons[1]).show();                            
                        }                        
                    });

                    $(config.audioTriggerButtons[1]).click(function(){
                        stopRecordingAudio();
                        $(config.audioTriggerButtons[1]).hide();
                        $(config.audioTriggerButtons[0]).show();
                    });                   
                    
                } else {
                    alert('Audio buttons specification have to be array');
                }
            }
            
            if (config.enableVideoStream) {
                if ($.isArray(config.videoTriggerButtons) === true) {
                    $(config.videoTriggerButtons[0]).show();
                    $(config.videoTriggerButtons[1]).hide();
                    
                    //When user clicks on video record
                    $(config.videoTriggerButtons[0]).click(function(){
                        
                        $(config.snapshotButton).hide();
                        $('video').hide();
                        $('window').focusout();
                        
                        //If recordingTime is set up
                        if (config.recordingTime > 0) {
                            
                            //start recording
                            if (config.recordAudioAndVideo === true) {
                                startRecordingAudio();
                            }
                            
                            startRecordingVideo();
                            
                            $(config.videoTriggerButtons[0]).hide();
                            
                            //Define a timer to end record(s)
                            var recordTimer = setTimeout( function(){
                                
                                if ((config.recordAudioAndVideo === true)) {
                                    
                                    //Asynchronous REAL TIME
                                    $.when(
                                        
                                        stopRecordingAudio(),
                                
                                        //Show record button again and snapshot
                                        $(config.videoTriggerButtons[0]).show(),
                                        $(config.snapshotButton).show(),                                        
                                       
                                        clearTimeout(recordTimer)
                                        
                                    ).then(function() {
                                        
                                        stopRecordingVideo();
                                       
                                        config.encode.call(this);
                                    });
                                    
                                } else {
                                    
                                    stopRecordingVideo();

                                    clearInterval(recordTimer);

                                    //Show record button again and snapshot
                                    $(config.videoTriggerButtons[0]).show();
                                    $(config.snapshotButton).show();                                    
                                }
                                
                            }, config.recordingTime);
                        
                        } else {
                            
                            startRecordingVideo();
                            
                            if ((config.recordAudioAndVideo === true) && (config.enableAudioStream === true)) {
                                startRecordingAudio();
                            }                            
                            
                            $(config.videoTriggerButtons[0]).hide();
                            $(config.videoTriggerButtons[1]).show();                            
                        }

                    });

                    $(config.videoTriggerButtons[1]).click(function(){
                        
                        if ((config.recordAudioAndVideo === true) && (config.enableAudioStream === true) && (config.recordingTime <= 0)) {
                            stopRecordingAudio();
                        }
                        stopRecordingVideo();
                        
                        $(config.videoTriggerButtons[1]).hide();
                        $(config.videoTriggerButtons[0]).show();
                    });                 
                    
                } else {
                    alert('Video buttons specification have to be array');
                }
            }            

        navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.AudioContext     = window.AudioContext || window.webkitAudioContext;
        window.URL              = window.URL || window.webkitURL;
            
        /* 
         * ENABLE WEBCAM AND AUDIO STREAM 
         * 
         */ 
            window.onload = function init() {
                if (config.enableAudioStream) {
                    try {
                        audio_context = new AudioContext;
                        console.log('Audio context set up.');
                        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
                    } catch (e) {
                        alert('No web audio support in this browser!');
                    }
                }
                
                navigator.getUserMedia({
                    audio: config.enableAudioStream, 
                    video: config.startCam
                }, startUserMedia, function(e) {
                    console.log('No live audio input or video stream: ' + e);
                });
            };
            
            function startUserMedia(stream) 
            {
                if (config.startCam) {
                    video.src = window.URL.createObjectURL(stream);
                    video.attr({'src': window.URL.createObjectURL(stream)});
                    localMediaStream = stream;
                }
                
                if (config.enableAudioStream) {
                    var input = audio_context.createMediaStreamSource(stream);
                    console.log('Media stream created.');

                    var zeroGain = audio_context.createGain();
                    zeroGain.gain.value = 0;
                    input.connect(zeroGain);
                    zeroGain.connect(audio_context.destination);
                    console.log('Input connected to muted gain node connected to audio context destination.');

                    recorder = new Recorder(input);
                    console.log('Recorder initialised.');
                }
            }          

        var WORKER_PATH         = config.recorderWorkerPath;
        
        //Specify Recorder
        var Recorder = function(source, cfg){
            var config = cfg || {};
            var bufferLen = config.bufferLen || 4096;
            this.context = source.context;
            this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
            var worker = new Worker(config.workerPath || WORKER_PATH);
            worker.postMessage({
              command: 'init',
              config: {
                sampleRate: this.context.sampleRate
              }
            });
            var recording = false,
              currCallback;

            this.node.onaudioprocess = function(e){
              if (!recording) return;
              worker.postMessage({
                command: 'record',
                buffer: [
                  e.inputBuffer.getChannelData(0),
                  e.inputBuffer.getChannelData(1)
                ]
              });
            }

            this.configure = function(cfg){
              for (var prop in cfg){
                if (cfg.hasOwnProperty(prop)){
                  config[prop] = cfg[prop];
                }
              }
            }

            this.record = function(){
              recording = true;
            }

            this.stop = function(){
              recording = false;
            }

            this.clear = function(){
              worker.postMessage({ command: 'clear' });
            }

            this.getBuffer = function(cb) {
              currCallback = cb || config.callback;
              worker.postMessage({ command: 'getBuffer' })
            }

            this.exportWAV = function(cb, type){
              currCallback = cb || config.callback;
              type = type || config.type || 'audio/wav';
              if (!currCallback) throw new Error('Callback not set');
              worker.postMessage({
                command: 'exportWAV',
                type: type
              });
            }

            worker.onmessage = function(e){
              var blob = e.data;
              currCallback(blob);
            }

            source.connect(this.node);
            this.node.connect(this.context.destination);    //this should not be necessary
        };        
        
        window.Recorder = Recorder;

        /* 
         * TAKE SNAPSHOT 
         * 
         */ 
            function takeSnapshot() 
            {
                $('canvas').attr({width: video.width(), height: video.height()});
                canvas.width = video.width();
                canvas.height = video.height();                 
                ctx.drawImage(video[0], 0, 0, video.width(), video.height());                        
                
                var result = canvas[0].toDataURL('image/'+config.snapShotFormat, config.pictureQuality);

                //Callback function with parameters
                if ($.isFunction(config.snapshotOnComplete)) {
                    config.snapshotOnComplete.call(this, result);
                }

                //Flashscreen
                if (config.snapshotFlashScreen !== false) {
                    $('body').fadeTo(config.snapshotFlashScreen.fadeIn, config.snapshotFlashScreen.fadeInSpeed).fadeTo(config.snapshotFlashScreen.fadeOut, config.snapshotFlashScreen.fadeOutSpeed);                    
                }
 
                //Play sound!
                if (window.HTMLAudioElement) {
                    snd = new Audio('');

                    if ($.inArray(audioFileExtension, audioExtensions) !== -1) {
                        if (snd.canPlayType('audio/' + audioFileExtension + '')) {
                            snd = new Audio(config.snapshotSound);

                            snd.play();
                            console.log(snd);

                            if (config.stop === true) {
                                console.log(snd.stop());
                            }

                        } else {
                           alert('Error! Unable to play ' + config.snapshotSound + '. Please check extension.'); 
                        }

                    } else {
                        console.log('Your file format is not recognized as audio file!');
                    }

                } else {
                    console.log('HTML5 Audio is not supported by your browser!');
                }                
            }

        /* 
         * RECORD AUDIO STREAM 
         * 
         */ 
            function startRecordingAudio() 
            {
                recorder && recorder.record();        
                console.log('Recording audio...');
            }

            function stopRecordingAudio() 
            {    
                recorder && recorder.stop();
                
                // create WAV download link using audio data blob
                createDownloadLink();

                recorder.clear();
                console.log('Stop Recording audio!');
            }

            function createDownloadLink() 
            {
                recorder && recorder.exportWAV(function(blob) {
                    
                    upload(blob, config.onAudioComplete);                   
                });
            }

            function upload(blobOrFile, onComplete) 
            {
                //Do callback action on video Complete
                if ($.isFunction(onComplete)) {
                    onComplete.call(this, blobOrFile, config.readyToEncode); 
                }               
            }            
        
        /*
        * RECORD VIDEO STREAM 
        */
            function startRecordingVideo() 
            {              
                frames      = []; // clear existing frames;
                startTime   = Date.now();
                console.log('Recording video...');

                function drawVideoFrame_(time) 
                {
                    rafId   = requestAnimationFrame(drawVideoFrame_);
                    
                    $('canvas').attr({width: video.width(), height: video.height()});
                    
                    ctx.drawImage(video[0], 0, 0, video.width(), video.height());
                    
                    var url = canvas[0].toDataURL('image/webp', 1); // image/jpeg is way faster :(

                    frames.push(url);
                };
                
                rafId = requestAnimationFrame(drawVideoFrame_);
            };

            function stopRecordingVideo() 
            {
                cancelAnimationFrame(rafId);
                endTime = Date.now();

                console.log('frames captured: ' + frames.length + ' => ' +
                            ((endTime - startTime) / 1000) + 's video');
                
                // 2nd param: framerate for the video file.
                var encoder = new Whammy.Video(15); 
                var webmBlob = Whammy.fromImageArray(frames, config.videoFrameRate);

                upload(webmBlob, config.onVideoComplete);                
            };    
        
        return this;       
    };
    
})(jQuery);

