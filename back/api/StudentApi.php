<?php
    require_once 'abstract-api.php';
    require_once '../controllers/StudentController.php';

    class StudentApi extends Api{

        function Read($params = null) {
            $studentCtrl = new StudentController;

            if (array_key_exists("student_name", $params) && array_key_exists("student_phone", $params) && array_key_exists("student_email", $params)) {
                //used to check if student by same name, phone & email found: js remote validation validationsStudent.js  method: studentAlreadyExists
                return  $studentCtrl->get_student_by_details($params); 
            }
            return $studentCtrl->getAll_Students();
        }

        function Create($params = null) {
            return $this->create_update($params, "Create");  
        }

        function Update($params = null) {
            return $this->create_update($params, "Update");  
        }

         function Delete($params = null) {

            $studentCtrl = new StudentController;
            $studentCtrl->delete_Student($params);
            $response_array['status'] = 'ok'; 
            $response_array['action'] = 'Delete student';
            $response_array['message'] = 'student deleted successfully'; 
            return $response_array;
        }

        function create_update($params, $function) {

            //used to return the following kind of errors to client: errors in input data, creating student that found etc. 
            $applicationError = "";
            
            //used to return msg to client about errors in upload this may be error in image itself: student image  size & file type or in upload attempt
            // => must be handled separately from $applicationError
            //insert/update student can be successfull but there might be problem with uploading image and this will be conveyed in the $response_array['status'] = 'ok'
            $ImageUploadError = "";
            $studentCtrl = new StudentController;
            $new_studentID = $studentCtrl->create_update_Student($params, $function, $applicationError, $ImageUploadError);

            if ($applicationError != "") {
                $response_array['status'] = 'error';  
                $response_array['action'] = $function . ' student';
                $response_array['message'] =  $applicationError; 
                return $response_array;
            }
            
            $response_array['status'] = 'ok'; 
            $response_array['action'] = $function . ' student';
            $response_array['message'] = ' student ' . ($function == "Create" ? 'added' : 'updated') . ' successfully';  
            $response_array['new_studentID'] = $new_studentID;
            if ($ImageUploadError != "") { //errors in student image upload
                $response_array['message'] .= "\n however; following errors in student image upload: " . $ImageUploadError ;  
            }
            return $response_array;
        }
    }
?>