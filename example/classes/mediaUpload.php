<?php
ini_set('memory_limit','1200M');
ini_set('post_max_size','120M');
ini_set('upload_max_filesize','120M');

if (isset($_POST['ffmpegPath'])) {
    
    /*
     * HERE, we encode .wav and .webm in one file
     */
    $ffmpegPath = (string) filter_input(INPUT_POST, 'ffmpegPath');
    $audio      = (string) filter_input(INPUT_POST, 'audioFilePath');
    $video      = (string) filter_input(INPUT_POST, 'videoFilePath');
    $output     = (string) filter_input(INPUT_POST, 'outputPath');
    $sleep      = (string) filter_input(INPUT_POST, 'sleep');    
    $delete     = (boolean) filter_input(INPUT_POST, 'deleteOld');

    sleep($sleep);
    
    exec("ffmpeg -i $video -i $audio -map 0:0 -map 1:0 $output");
    
    if ($delete) {
        sleep($sleep);
        if (file_exists($audio)) {
            unlink($audio);
        }
        if (file_exists($video)) {
            unlink($video);
        }               
    }

} else {

    /*
     * HERE, we save .wav and .webm files individualy
     */    
    $filename       = (string) filter_input(INPUT_GET, 'filename');
    $mediaPath      = (string) filter_input(INPUT_GET, 'path');
    $format         = (string) filter_input(INPUT_GET, 'format');
    $absolutePath   = $mediaPath . $filename . $format;

    $media          = file_get_contents('php://input');

    //Create file and return status
    echo (file_put_contents($absolutePath, $media)) ? true : false ;    
}
