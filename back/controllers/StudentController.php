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
                array_push($allStudents, new StudentModel(["studentID" => $row['studentID'], 
                                                           "studentName" => $row['studentName'],
                                                           "studentPhone" => $row['studentPhone'],
                                                           "studentEmail" => $row['studentEmail'],
                                                           "studentCourses" => $row['studentCourses']],$errorInInput, "select"));
            }
            return $allStudents;
        }

        function create_update_Student($params, $method, &$applicationError, &$ImageUploadError) {
            $student = new StudentModel($params, $applicationError, "update");
            if ($applicationError != "") { //error found in data members of student object - faulty user input
                return;
            }

            $student_bll = new Student_BLL();
            if ($method == "Create") {
                $studentID =  $student_bll->insert_student($student, $applicationError);
                $new_studentID =  $studentID['new_student_id'];         
            }

            if ($method == "Update") { //update $new_studentID irrelevant set default value 
                // $studentID =  $student_bll->update_student($student, $applicationError);
                $student_bll->update_student($student, $applicationError);
                $new_studentID = 0;
            }

            //save student image
            $imgHandling = new ImageHandling();
            //test if update with option to delete image (checkbox deleteImage) Delete Image on Server
            if (array_key_exists("delete_image", $params)) {
                $imgHandling->delete_image($student->getStudentID(), "student");
                return $new_studentID;
            }
            //if new student send new student id returned from mysql if update send studentID of updated student to handle_student_image function any errors 
            //in image selected by user or error in attempts to save image will be written to $ImageUploadError so they can be sent back to user
            $imgHandling->save_uploaded_image(
                $method == "Create" ? $new_studentID :  $student->getStudentID(), 
                "student", $ImageUploadError);
            return $new_studentID;
        }

        function delete_Student($params) {
            $student_bll = new Student_BLL();
            $student_bll->delete_student($params);
            //delete student image stored in images folder
            $imgHandling = new ImageHandling();
            $imgHandling->delete_image($params["studentID"], "student");
        }
        
        //used for js remote validation validationsStudent.js  method: studentAlreadyExists
        function get_student_by_details($params) { 
            $student_bll = new Student_BLL();
            $result = $student_bll->check_student_exists($params);
            $studentID = $result[id];
            if ($studentID == false){ //no student found with given student name, mail & phone
                $studentID = -1;
            }
            $response_array['status'] = 'ok';  
            $response_array['studentID'] = $studentID;
            return $response_array;
        }
    }
?>