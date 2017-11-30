<?php 

    require_once '../models/StudentModel.php';
    require_once '../bl/Student_BLL.php';
    require_once '../share/ImageHandling.php';
    
    class StudentController {


        function getAll_Students() {
            $student_bll = new Student_BLL();
            $resultSet = $student_bll->get_students();

            $allStudents = array();
            //$errorInInput will contain any problems found in data retrieved from db () creating StudentModel
            //object automatically validates the data - at this stage no further processing occurs with any faulty
            //db data
            $errorInInput = ""; 
            
            while ($row = $resultSet->fetch())
            {                           
                array_push($allStudents, new StudentModel(["student_id" => $row['student_id'], 
                                                           "student_name" => $row['student_name'],
                                                           "student_phone" => $row['student_phone'],
                                                           "student_email" => $row['student_email'],
                                                           "student_courses" => $row['student_courses']],$errorInInput, "select"));
            }
            return $allStudents;
        }

        function create_update_Student($params, $method, &$applicationError, &$ImageUploadError) {
            $student = new StudentModel($params, $applicationError, "update");
            if ($applicationError != "") { //error found in data members of student object - faulty user input
                return;
            }
            $student_bll = new Student_BLL();
            //insert => if student already exists  $applicationError will contain corresponding message and StudentApi.php will send apropriate message back to client 
           //@@@@@@@@@@@@ $studentID =  $student_bll->insert_update_student($student, $method, $applicationError);
            if ($method == "Create"){
                $studentID =  $student_bll->insert_student($student, $applicationError);
                $new_studentID =  $studentID['new_student_id'];         
            }
            else { //update $new_studentID irrelevant set default value 
                $studentID =  $student_bll->update_student($student, $applicationError);
                $new_studentID = 0;
            }

            //save student image
            $imgHandling = new ImageHandling();
            //test if update with option to delete image (checkbox deleteImage) Delete Image on Server
            if ($method == "Update" && array_key_exists("delete_image", $params)) {
                $imgHandling->delete_image($params["student_id"], "student");
            }
            else {
                //if new student send new student id returned from mysql if update send student_id of updated student to handle_student_image function any errors 
                //in image selected by user or error in attempts to save image will be written to $ImageUploadError so they can be sent back to user
                $imgHandling->save_uploaded_image($method == "Create" ? $new_studentID :  $params["student_id"], "student", $ImageUploadError);
            }
            return $new_studentID;
        }

        function delete_Student($params) {
            $student_bll = new Student_BLL();
            $student_bll->delete_student($params);
            //delete student image stored in images folder
            $imgHandling = new ImageHandling();
            $imgHandling->delete_image($params["student_id"], "student");
        }
        
        //used for js remote validation validationsStudent.js  method: student_already_exists
        function get_student_by_details($params) { 
            $student_bll = new Student_BLL();
            $student_id = $student_bll->check_student_exists($params);
            if ($student_id == false){ //no student found with given student name
                $student_id = ["status" => -1];
            }
            return $student_id;
        }
    }
?>