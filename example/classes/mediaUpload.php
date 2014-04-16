<?php
ini_set('memory_limit','1200M');
ini_set('post_max_size','120M');
ini_set('upload_max_filesize','120M');

if (isset($_POST['encoderEnvPath'])) {
    
    /*
     * HERE, we encode .wav and .webm in one file
     */
    $encoderEnvPath = (string) filter_input(INPUT_POST, 'encoderEnvPath');
    $audio          = (string) filter_input(INPUT_POST, 'audioFilePath');
    $video          = (string) filter_input(INPUT_POST, 'videoFilePath');
    $output         = (string) filter_input(INPUT_POST, 'outputPath');
    $sleep          = (string) filter_input(INPUT_POST, 'sleep');    
    
    $i = 0;
    $startTime = 0;
    $endTime = 0;
    
    do {
        if (file_exists($audio) && file_exists($video)) {
            echo 'Start media encoding...'."\n";    
            $startTime = time();

            exec("$encoderEnvPath -i $video -i $audio -map 0:0 -map 1:0 $output");

            $endTime = time();
            $i = 1;
        }
            
    }while($i <= 0);
    
    $duration = $endTime - $startTime;
    echo "Encoding time = $duration seconds"."\n";
    echo 'ok';

} else {

    /*
     * HERE, we save .wav and .webm files individualy
     */    
    $filename       = (string) filter_input(INPUT_GET, 'filename');
    $mediaPath      = (string) filter_input(INPUT_GET, 'path');
    $format         = (string) filter_input(INPUT_GET, 'format');
    $absolutePath   = $mediaPath . $filename . $format;

    $media          = file_get_contents('php://input');
    
    //If image is sent
    if (substr($media, 0, 10) === 'data:image') {
        $format         = str_replace('.', '', $format);
        $media          = base64_decode(str_replace('data:image/'.$format.';base64,','', $media));
    }
    
    //Create file and return status
    echo (file_put_contents($absolutePath, $media)) ? "$format ok!" : "$format error!" ;    

    usleep(1700);    
}
