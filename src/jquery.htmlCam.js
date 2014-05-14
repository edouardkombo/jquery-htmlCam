/*
 * jQuery htmlCam
 * Version 0.1 (@edouardkombo)
 * https://github.com/edouardkombo/jquery-htmlCam
 *
 * Activate webcam, record audio and video simultaneously with custom AEC (Acoustic echo canceller), no echo on audio.
 * Enable you to encode audio and video with a converter of your choice.
 *
 * Copyright (c) 2014 Edouard Kombo (@edouardkombo)
 * Dual licensed under the MIT and GPL licenses.
*/
(function($){

    $.htmlCam = function (settings) {
        
        //Config
        var config = {
            startCam: true,
            recorder: '',
            recordingTime: 10,
            enableRecord: false, //If true, both recording is done by video
            onAudioComplete: 'null',          
            onVideoComplete: 'null',
            videoTriggerButtons: ''        
        };       
        
        if (settings) {
            $.extend(config, settings);
        }

        //Initiate navigator.GetUserMedia
        navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.AudioContext     = window.AudioContext || window.webkitAudioContext;
        window.URL              = window.URL || window.webkitURL;        

        //Variables definition
        var video,
        frames,
        rafId,
        startTime,
        endTime,
        localMediaStream,
        audio_context,
        zeroGain,
        audio,
        recorder,
        canvas,
        ctx,
        rafRecording,
        hasAlreadyBeenRecordedOnce = false,
        realRecordingTime,
        expectedEndingTime  = 0,        
        allRecordsStarted   = true;

        /**
         * Create a tag if not exist, otherwhise, fetch it
         * 
         * @param {string} tag
         * @returns {undefined}
         */
        function createIfNotExist(tag) 
        {           
            if (tag === 'video') {
                video               = ($('video').length > 0) ? $("video") : $('<video>').attr({id: 'video', autoplay:'true'}).appendTo("body");   
                video.css({'visibility':'hidden'});
                $('video').hide();
                
            } else if (tag === 'audio') {
                audio_context;
                zeroGain            = '';
                audio               = ($('audio').length > 0) ? $("audio") : $('<audio>').attr({id: 'audio'}).appendTo("body");
                recorder            = config.recorder;
                
            } else if (tag === 'canvas') {
                canvas              = ($('canvas').length > 0) ? $("canvas") : $('<canvas>').attr({id: 'canvas', visibility: 'hidden'}).appendTo("body");
                ctx                 = canvas[0].getContext('2d');
                canvas.css({'visibility':'hidden'});
                $('canvas').attr({width: video.width(), height: video.height()});
            }
        }
        
        createIfNotExist('video');
        createIfNotExist('audio');
        createIfNotExist('canvas');   
        
        window.onload = function init() {
            try {
                audio_context = new AudioContext;
                console.log('Audio context set up.');
                console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
            } catch (e) {
                alert('No web audio support in this browser!');
            }

             navigator.getUserMedia({
                 audio: true, 
                 video: true
             }, startUserMedia, function(e) {
                 console.log('No live audio input or video stream: ' + e);
             });
        };

        /**
         * Init getUserMedia with AEC (Acoustic echo cancellation)
         * No echo
         * 
         * @param {object} stream
         * @returns {Recorder.Recorder}
         */
        function startUserMedia(stream) 
        {
           video.src = window.URL.createObjectURL(stream);
           video.attr({'src': window.URL.createObjectURL(stream)});
           localMediaStream = stream;

           var context         = new AudioContext;
           var microphone      = context.createMediaStreamSource(stream);
           var gainFilter      = context.createGain();
           var destination     = context.createMediaStreamDestination();
           var outputStream    = destination.stream;

           gainFilter.gain.value = 1;

           microphone.connect(gainFilter);
           gainFilter.connect(destination);

           stream.removeTrack(stream.getAudioTracks()[0]);
           stream.addTrack(outputStream.getAudioTracks()[0]);

           recorder = new Recorder(microphone);
        }        
        
        /**
         * End audio and video record
         * 
         * @returns {Boolean}
         */
        function endAllRecords()
        {
            stopRecordingAudio();
            stopRecordingVideo();
            
            allRecordsStarted = true;
            hasAlreadyBeenRecordedOnce = false;
            
            return true;
        }
        
        /**
         * Start all records
         * 
         * @returns {Boolean}
         */
        function startAllRecords()
        {
            createIfNotExist('video');
            
            //start recording
            startRecordingAudio();
            startRecordingVideo();

            allRecordsStarted           = true;
            hasAlreadyBeenRecordedOnce  = true;
            expectedEndingTime          = Date.now() + (config.recordingTime*1000);
            
            rafRecording                = requestAnimationFrame(whileRecording);
            
            return true;
        }


        /**
         * Actions while recording to automatically stop record
         * 
         * @returns {Boolean}
         */
        function whileRecording() 
        {
            setTimeout(function() {
                if (hasAlreadyBeenRecordedOnce && !allRecordsStarted) {
                    realRecordingTime = Date.now();
                    console.log(realRecordingTime + ' => ' + expectedEndingTime);

                    if (realRecordingTime >= expectedEndingTime) {
                        endAllRecords();
                        cancelAnimationFrame(rafRecording);
                        clearTimeout();
                        
                        return true;
                        
                    } else {
                        rafRecording = requestAnimationFrame(whileRecording);
                    }
                } else {
                    return false;
                }
            }, 1000);

            return true;
        }

        //Events that trigger record
        if (config.enableRecord) {

            if ($.isArray(config.videoTriggerButtons) === true) {

                //When user clicks on video record
                $(config.videoTriggerButtons[0]).click(function(){
                    startAllRecords();
                });

                //When user clicks on record end
                $(config.videoTriggerButtons[1]).click(function(){
                    if (allRecordsStarted) {
                        console.log('Records are not yet ready!!');
                        if (hasAlreadyBeenRecordedOnce) {
                            allRecordsStarted = false;
                        }
                    } else {
                        console.log('Records will be stopped!');
                        endAllRecords();
                    }
                });                    
            }
        }

        
        /**
         * Start recording an audio file
         * 
         * @returns {Boolean}
         */
        function startRecordingAudio() 
        {  
            recorder && recorder.record();        
            console.log('Recording audio...');
            return true;
        }

        /**
         * Stop recording audio file
         * 
         * @returns {Boolean}
         */
        function stopRecordingAudio() 
        {
            recorder && recorder.stop();

            recorder && recorder.exportWAV(function(blob) {       
                upload(blob, config.onAudioComplete);                   
            });

            recorder.clear();
            console.log('Stop Recording audio!');
            return true;
        }           
        
        /**
         * Start recording video
         * 
         * @returns {undefined}
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
        }

        /**
         * Stop recording a video
         * Autodetect fps
         * 
         * @returns {undefined}
         */
        function stopRecordingVideo() 
        {
            cancelAnimationFrame(rafId);
            endTime = Date.now();
            
            //Delete video stream to save bandwidth
            $('video').remove();

            //Recorded time
            var recordedTime = (endTime - startTime)/1000;

            console.log('Captured frames: ' + frames.length + ' => ' + recordedTime + 's video');

            //We consider that the normal gap between Max recording time and real user recording time is 1s
            //When the gap is greater than 1s, we auto-check the fps to synchronize the medias
            var recordingGap        = config.recordingTime - recordedTime;

            //Detect fps
            var fps                 = (frames.length / recordedTime).toFixed(1); 
            var encodingRatio       = fps; 

            //Expected frames depend on when user goes till video end or stop it himself
            var expectedFrames      = (recordingGap <= 1) ? encodingRatio * config.recordingTime : encodingRatio * recordedTime ;
            var unexpectedFrames    = frames.length - expectedFrames; 

            //If there are more frames than exected
            if (unexpectedFrames > 0) {
                for (i = 0; i <= unexpectedFrames; i++) { 
                   frames.pop();
                }

            } else {
                encodingRatio   = ((frames.length * fps) / expectedFrames).toFixed(3);
            }                

            console.log('My FPS => '+ fps);
            console.log(encodingRatio);              

            // 2nd param: framerate for the video file.
            var encoder = new Whammy.Video();
            var webmBlob = Whammy.fromImageArray(frames, encodingRatio);

            upload(webmBlob, config.onVideoComplete);                
        }
            
        /**
         * Upload audio or video file
         * 
         * @param {object} blobOrFile
         * @param {string} onComplete
         * 
         * @returns {Boolean}
         */
        function upload(blobOrFile, onComplete) 
        {
            //Do callback action on video Complete
            if ($.isFunction(onComplete)) {
                return onComplete.call(this, {content: blobOrFile, stream: localMediaStream});
            }
            return false;
        } 
        
        return this;       
    };
    
})(jQuery);

