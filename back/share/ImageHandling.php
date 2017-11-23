<?php

    require_once 'ErrorHandling.php';

    //constant containing image folder - I place them in this file although they are global they are only relevant in connection to ImageImageHandling
    define("UPLOAD_FOLDER", "images");

    class ImageHandling { 

        public function save_uploaded_image($method, $ID, $entity, &$ImageUploadError) {   
            $imageName =  $entity . "_image";
            if (isset($_FILES[$imageName])) {
                $this->check_image($ImageUploadError, $imageName);
                if ($ImageUploadError == ""){   // $ImageUploadError == "" means no errors were found
                    $image_dir = "\\" . UPLOAD_FOLDER . "\\" ;
                    $target_dir = "\\" . UPLOAD_FOLDER . "\\" . $entity . "s\\";
                    
                    //check if image directory exists - if not create int
                    if (!file_exists( $GLOBALS['siteRoot'] . "\\" . $image_dir . "\\" )) {
                        mkdir($GLOBALS['siteRoot'] . "\\" . $image_dir . "\\", 0777, true);
                    }
                    //check if courses/students & administrator directory (under image directory) 
                    //exists - if not create it
                    if (!file_exists( $GLOBALS['siteRoot'] . "\\" . $target_dir . "\\" )) {
                        mkdir($GLOBALS['siteRoot'] . "\\" . $target_dir . "\\", 0777, true);
                    }


                    $target_file =  $GLOBALS['siteRoot'] . $target_dir .  "image_for_" . $entity ."_id_" . $ID . ".jpg";
                    

                    if($_FILES[$imageName]['type'] != 'image/jpeg') {//convert all non jpg files (gif & bmp) to jpg
                        // create image resource
                        $img = imagecreatefromjpeg($_FILES[$imageName]['tmp_name']);
                        imagejpeg($img, $_FILES[$imageName]['tmp_name'] );
                        // free memory associated with image resource
                        imagedestroy($img);
                    }
                    $moved = move_uploaded_file($_FILES[$imageName]["tmp_name"], $target_file);
                    if (!$moved){
                        $ImageUploadError = "\n error uploading image - contanct support center"; //client gets general message  
                        ErrorHandling::LogApplicationError($_FILES[$imageName]["error"]); //write exact error to error log - But don't send it to client 
                    }
                }
            }
        }

        private function check_image(&$ImageUploadError, $imageName) {   

            $imageFileType = pathinfo($_FILES[$imageName]["name"], PATHINFO_EXTENSION);
            if (strtolower($imageFileType) != "jpg" && 
                strtolower($imageFileType) != "png" && 
                strtolower($imageFileType) != "jpeg" && 
                strtolower($imageFileType) != "gif" ) {
                $ImageUploadError = htmlspecialchars("\n only jpg, jpeg, png & gif files are allowed");
            }

            if ($_FILES[$imageName]["size"] > 5000000) {  
                $ImageUploadError .= "\n file size (" . $_FILES[$imageName]["size"] . ") is too large - max file size allowed : 5'000'000 bytes" ;
            }
        }

        public function delete_image($ID, $entity) {

            $glob_pattern = 
                $GLOBALS['siteRoot'] . "\\" . UPLOAD_FOLDER.  "\\" . $entity . "s\\/" . "image_for_" . $entity ."_id_" . $ID . ".{jpg}";
            $image = glob($glob_pattern, GLOB_BRACE);
            if (!empty($image)) {
                $unlink_successful =  unlink($image[0]);
                if (!$unlink_successful) { //if deleteing image failed write to error log BUT don't return error to client
                    ErrorHandling::LogApplicationError("unlink of " . $entity . " for " . $entity ."_id " . $ID . " failed"); 
                }
            }
        }            
    }
?>