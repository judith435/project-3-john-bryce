<?php
    require_once 'abstract-api.php';
    require_once '../controllers/CourseController.php';

    class CourseApi extends Api{

        function Read($params) {
            $courseCtrl = new CourseController;
           
            if (array_key_exists("course_name", $params)) { 
                //used to check if course by same name already exists: js remote validation validationsCourse.js  method: course_already_exists
                return  $courseCtrl->getCourseByName($params); 
            }
            return $courseCtrl->getAll_Courses();
        }

        function Create($params) {
            return $this->create_update($params, "Create");  
        }

        function Update($params) {
            return $this->create_update($params, "Update");  
        }

         function Delete($params) {

            $courseCtrl = new CourseController;
            $courseCtrl->delete_Course($params);
            $response_array['status'] = 'ok'; 
            $response_array['action'] = 'Delete course';
            $response_array['message'] = 'course deleted successfully'; 
            return $response_array;
        }

        function create_update($params, $function) {

            //used to return the following kind of errors to client: errors in input data, creating course that already exists etc. 
            $applicationError = "";
            
            //used to return msg to client about errors in upload this may be error in image itself: course image  size & file type or in upload attempt
            // => must be handled separately from $applicationError
            //insert/update course can be successfull but there might be problem with uploading image and this will be conveyed in the $response_array['status'] = 'ok'
            $ImageUploadError = "";
            $courseCtrl = new CourseController;
            $new_courseID = $courseCtrl->create_update_Course($params, $function, $applicationError, $ImageUploadError);

            if ($applicationError != "") {
                $response_array['status'] = 'error';  
                $response_array['action'] = $function . ' course';
                $response_array['message'] =  $applicationError; 
            }
            else {
                $response_array['status'] = 'ok'; 
                $response_array['action'] = $function . ' course';
                $response_array['message'] = ' course ' . ($function == "Create" ? 'added' : 'updated') . ' successfully';  
                $response_array['new_courseID'] = $new_courseID;
                if ($ImageUploadError != "") { //errors in course image upload
                    $response_array['message'] .= "\n however; following errors in course image upload: " . $ImageUploadError ;  
                }
            }

            return $response_array;
        }
    }
?>