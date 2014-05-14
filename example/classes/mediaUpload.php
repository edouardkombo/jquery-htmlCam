<?php

session_start();

ini_set('memory_limit', '120M');
ini_set('post_max_size', '120M');
ini_set('upload_max_filesize', '120M');

/**
 * Copy folder to another
 * 
 * @param string $src
 * @param string $dst
 */
function rcopy($src, $dst) {

    if (is_dir($src)) {

        error_log(__FILE__ . ':' . __FUNCTION__ . ':' . __LINE__ . '   [deleteme] ' . realpath($dst) . PHP_EOL);

        $files = scandir($src);
        foreach ($files as $key => $file) {
            if ($file === "." || $file === "..") {
                unset($files[$key]);
            }
        }

        $files = array_values($files);
        foreach ($files as $folder) {

            $thisFolder = scandir($src . $folder);
            foreach ($thisFolder as $k => $internalFolder) {
                if ($internalFolder === "." || $internalFolder === "..") {
                    unset($thisFolder[$k]);
                }
            }

            if (count($thisFolder) >= 2) {
                foreach ($thisFolder as $kk => $lastFiles) {

                    if (!is_dir($dst . $folder)) {
                        error_log(__FILE__ . ':' . __FUNCTION__ . ':' . __LINE__ . '   [deleteme] ' . $dst . $folder . PHP_EOL);
                        mkdir($dst . $folder);
                    }

                    copy($src . '/' . $folder . '/' . $lastFiles, $dst . $folder . '/' . $lastFiles);
                }
            }
        }
    } else if (file_exists($src)) {
        copy($src, $dst);
    }
    return true;
}

/**
 * Delete specified files and folders recursively
 * 
 * @param string $dir
 * @param string $baseDir
 */
function rrmdir($dir, $baseDir) {
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (filetype($dir . "/" . $object) == "dir")
                    rrmdir($dir . "/" . $object, $baseDir);
                else
                    unlink($dir . "/" . $object);
            }
        }
        reset($objects);
        echo var_dump($dir . ' => ' . $baseDir);
        if ($dir !== $baseDir) {
            rmdir($dir);
        }
    }
    return true;
}

/**
 * Disconnect
 */
function logOff() {
    unset($_SESSION['id']);
    unset($_SESSION);
    session_unset();
    session_destroy();
}

/**
 * List all directories
 * 
 * @param string $dir
 * @return array
 */
function listDir($dir)
{
    $dirs = array();
    
    if ($handle = opendir($dir)) {
        while (false !== ($entry = readdir($handle))) {
            if ($entry != "." && $entry != "..") {
                array_push($dirs, $entry);
            }
        }
        closedir($handle);
    }
    
    return $dirs;
}


/**
 * Get current folder id
 * 
 * @param string $path
 * 
 * @return integer
 */
function getId($path) {
    
    $absolutePath = $_SERVER['DOCUMENT_ROOT'] . $path;
    //Number of directories
    $nd = (count(glob("$absolutePath/*", GLOB_ONLYDIR)));
    
    //Id of the session
    if (!isset($_SESSION['id'])) {
        
        if ($nd >= 1) {
            $allDirs    = listDir($absolutePath);
            $highestDir = max($allDirs);
            $id         = $highestDir + 1;
            
        } else {
            $id         = 1;
        }
        
        $_SESSION['id'] = $id;
        
    } else {
        $id = $_SESSION['id'];
    }

    return $id;
}

/**
 * Create directory recursively
 * 
 * @param string $path
 * @param id $id
 * 
 * @return boolean
 */
function createDir($path, $id) {
    //Create directories
    $directory = $_SERVER['DOCUMENT_ROOT'] . $path . $id;
    if (!is_dir($directory)) {
        if (mkdir($directory, 0777, true)) {
            return true;
        }
    }

    return false;
}

if (isset($_POST['finalFormat'])) {

    /*
     * HERE, we encode .wav and .webm in one file
     */
    $path = (string) filter_input(INPUT_POST, 'path');
    $id = getId($path);

    //Create directory
    createDir($path, $id);
    
    $audioFormat        = (string) filter_input(INPUT_POST, 'audioFormat');
    $videoFormat        = (string) filter_input(INPUT_POST, 'videoFormat');
    $finalVideoFormat   = (string) filter_input(INPUT_POST, 'finalFormat');

    $basePath = (string) $_SERVER['DOCUMENT_ROOT'] . $path . $id . '/' . $id;
    //$basePath = (string) '..' . $path . $id . '/' . $id;
    
    $audio = (string) $basePath . $audioFormat;
    $video = (string) $basePath . $videoFormat;
    $output = (string) $basePath . $finalVideoFormat;   
    
    $sleep = (string) filter_input(INPUT_POST, 'sleep');
    $delete = (boolean) filter_input(INPUT_POST, 'deleteOld');    
    

    //We first delete the output if there is already one
    if (file_exists($output) || is_file($output)) {
        unlink($output);
    }
    
    shell_exec("ffmpeg -i $video -i $audio -strict experimental -map 0:0 -map 1:0 $output");

    $i = -1;
    
    for ($i=0; $i<2; $i--) 
    {
        if (is_file($output)) {
            sleep(1);
            break;
        }
    }
    
    if ($delete) {
        if (file_exists($audio)) {
            unlink($audio);
        }
        if (file_exists($video)) {
            unlink($video);
        }
    }
    
    echo $path . $id . '/' . $id . $finalVideoFormat;    
    
} elseif (isset($_POST['newsletter'])) {

    $email = filter_input(INPUT_POST, 'email');
    $path = filter_input(INPUT_POST, 'path');
    $establishment = filter_input(INPUT_POST, 'establishment');
    $_newsletter = filter_input(INPUT_POST, 'newsletter');
    $newsletter = ($_newsletter === 1) ? 1 : 0;

    $id = getId($path);

    $absolutePath = $_SERVER['DOCUMENT_ROOT'] . $path . $id;
    
    //Create directory
    createDir($path, $id);

    //Save producer infos
    $filename = $absolutePath . "/$id.ini";
    $datas = "[user]" . "\r\n";
    $datas .= "firstname = ''" . "\r\n";
    $datas .= "lastname = ''" . "\r\n";
    $datas .= "gender = ''" . "\r\n";
    $datas .= "email = '$email'" . "\r\n";
    $datas .= "code = ''" . "\r\n";
    $datas .= "newsletter = '$newsletter'" . "\r\n";
    $datas .= "variable = '2'" . "\r\n";
    $datas .= "establishment = '" . $establishment . "'" . "\r\n" . "\r\n";   
    
    $handle = fopen($filename, 'w+');
    if (fwrite($handle, $datas)) {
        fclose($handle);
        echo 'Form .ini creation OK//';
    }
    
} elseif (isset($_POST['fetch'])) {

    $path           = (string) filter_input(INPUT_POST, 'path');
    $format         = (string) filter_input(INPUT_POST, 'format');
    $id             = getId($path);

    $media          = $path . $id . DIRECTORY_SEPARATOR . $id . $format;
    $absolutePath   = $_SERVER['DOCUMENT_ROOT'] . $media;

    $firstArray     = array('\\', '/', '%5C');
    $secondArray    = array('/', '/', '/');
    
    $media          = str_replace($firstArray, $secondArray, $media);
    $absolutePath   = str_replace($firstArray, $secondArray, $absolutePath);    
   
    //echo $absolutePath;
    if (is_file($absolutePath)) {
        echo $media;
    } else {
        echo $media;
    }
    
} elseif (isset($_POST['finalPath'])) {

    $path = (string) $_SERVER['DOCUMENT_ROOT'] . filter_input(INPUT_POST, 'path');
    $finalPath = (string) $_SERVER['DOCUMENT_ROOT'] . filter_input(INPUT_POST, 'finalPath');

    echo rcopy($path, $finalPath);
    echo rrmdir($path, $path);

    logOff();
    
} else {

    /*
     * HERE, we save .wav and .webm files individualy
     */
    $path = (string) filter_input(INPUT_GET, 'path');
    $id = getId($path);
    $folder = $id;
    $filename = (string) (isset($_GET['filename'])) ? filter_input(INPUT_GET, 'filename') : $id;
    $format = (string) filter_input(INPUT_GET, 'format');
    $type = (string) filter_input(INPUT_GET, 'type');
    $absolutePath   = $_SERVER['DOCUMENT_ROOT'] . $path . $folder . DIRECTORY_SEPARATOR . $filename . $format;
    $simplePath     = $path . $folder . DIRECTORY_SEPARATOR . $filename . $format;

    //Create directory
    createDir($path, $id);

    $media = file_get_contents('php://input');

    if ($type === 'picture') {
        $_format = str_replace('.', '', $format);
        $encoded = base64_decode(str_replace('data:image/' . $_format . ';base64,', '', $media));
        $media   = $encoded;
    }

    $firstArray     = array('\\', '/', '%5C');
    $secondArray    = array('/', '/', '/');
    
    $absolutePath   = str_replace($firstArray, $secondArray, $absolutePath);
    $simplePath     = str_replace($firstArray, $secondArray, $simplePath);
    
    //On supprime d'abord le contenu préalable
    if (file_exists($absolutePath) || is_file($absolutePath)) {
        unlink($absolutePath);
    }
    
    //Create file and return status
    (file_put_contents($absolutePath, $media)) ? true : false;
        
    
    echo $simplePath;
}
