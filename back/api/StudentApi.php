<?php
    require_once 'abstract-api.php';
    require_once '../controllers/StudentController.php';

    class StudentApi extends Api{

        function Read($params) {
            $sc = new StudentController;

            if (array_key_exists("student_name", $params) && array_key_exists("student_phone", $params) && array_key_exists("student_email", $params)) {
                //used to check if student by same name already exists: js remote validation validationsStudent.js  method: student_already_exists
                return  $sc->getStudentByName($params); 
            }
            else {
                return $sc->getAll_Students();
            }
        }

        function Create($params) {
            return $this->create_update($params, "Create");  
        }

        function Update($params) {
            return $this->create_update($params, "Update");  
        }

         function Delete($params) {

            $sc = new StudentController;
            $sc->delete_Student($params);
            $response_array['status'] = 'ok'; 
            $response_array['action'] = 'Delete student';
            $response_array['message'] = 'student deleted successfully'; 
            return $response_array;
        }

        function create_update($params, $function) {

            //used to return the following kind of errors to client: errors in input data, creating student that already exists etc. 
            $applicationError = "";
            
            //used to return msg to client about errors in upload this may be error in image itself: student image  size & file type or in upload attempt
            // => must be handled separately from $applicationError
            //insert/update student can be successfull but there might be problem with uploading image and this will be conveyed in the $response_array['status'] = 'ok'
            $ImageUploadError = "";
            $sc = new StudentController;
            $new_studentID = $sc->create_update_Student($params, $function, $applicationError, $ImageUploadError);

            if ($applicationError != "") {
                $response_array['status'] = 'error';  
                $response_array['action'] = $function . ' student';
                $response_array['message'] =  $applicationError; 
            }
            else {
                $response_array['status'] = 'ok'; 
                $response_array['action'] = $function . ' student';
                $response_array['message'] = ' student ' . ($function == "Create" ? 'added' : 'updated') . ' successfully';  
                $response_array['new_studentID'] = $new_studentID;
                if ($ImageUploadError != "") { //errors in student image upload
                    $response_array['message'] .= "\n however; following errors in student image upload: " . $ImageUploadError ;  
                }
            }

            return $response_array;
        }
    }
?>