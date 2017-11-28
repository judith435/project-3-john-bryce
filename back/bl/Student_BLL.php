<?php
    error_reporting(0);

    require_once '../share/ErrorHandling.php';
    require_once 'BusinessLogicLayer.php';
    
    class Student_BLL  extends BusinessLogicLayer{

        function __construct() {
            parent::__construct('school');
        }

        public function get_students() {
            $emptyParms = []; 
            return parent::get($this->get_dbName(), 'get_students', $emptyParms);
        }

        public function insert_update_student($student, $method,  &$applicationError) {

            $spParms =  array(); //contains stored procedure input parms 

            //check student by same name, phone & email do not already exist
            array_push($spParms, new PDO_Parm("student_name", $student->getStudentName(), 'string'));  
            array_push($spParms, new PDO_Parm("student_phone", $student->getStudentPhone(), 'string'));
            array_push($spParms, new PDO_Parm("student_email", $student->getStudentEmail(), 'string'));

            $resultSet = parent::get($this->get_dbName(), 'check_student_exists', $spParms);
            if ($resultSet->rowCount() > 0) { //student with same name, phone & email already exists
                $duplicate_student = $resultSet->fetch();
                if (($method == "Create") || //create if student with student with same name, phone & email already exist then error
                    //update if student with same name, phone & email already exist then error only if student_id different - otherwise referring to student being updated
                    ($method == "Update" && $duplicate_student["id"] != $student->getStudentID())) { 
                        $applicationError =  "student with same name, phone & email already exist - student id #" . $duplicate_student["id"];
                        return;
                }
            }
            //-------------------------------------------------------------------------------------------------------------------------------------

            $studentID = 0;

            if ($method == "Update") {  //for update must add student_id as first parameter
                    array_unshift($spParms, new PDO_Parm("student_id", $student->getStudentID(), 'integer'));
            }

            $spName = $method == "Create" ? 'insert_student' : 'update_student';

            //build string containing id's of all courses student is assigned to => serves as sp parm student_courses 
            $student_courses = ""; 
            $studentCourses = $student->getStudentCourses();
            if (!empty($studentCourses)) {
                foreach($studentCourses as $course) { 
                    $student_courses .= "," . str_replace("cbCourse", "", $course);
                } 
            }
            $student_courses = substr($student_courses, 1);
            array_push($spParms, new PDO_Parm("student_courses", $student_courses, 'string'));
            //-------------------------------------------------------------------------------------------------------------------------------------

            //add/update student
            $result = parent::get($this->get_dbName(), $spName, $spParms);

            $studentID = $result->fetch();
            if ($method == "Create") { //insert student
                if ($studentID['new_student_id'] == -1){ //new_student_id = -1 sp insert_student failed
                    $applicationError =  "adding new student failed - please contact support center"; 
                }
            }
            else { //update student
                if ($studentID['student_id'] == -1){ //student_id = -1 sp update failed
                    $applicationError =  "updating student failed - please contact support center"; 
                }
            }

            if ( $applicationError != "" ){ //insert or update student failed
                //write entry to error log on server with parameters used to call sp insert_student/update_student so error in mysql can be recreated 
                ErrorHandling::LogApplicationError("error in sp " . $spName . " sp parameter used: " . 
                    implode(";  ", array_map(function ($parm) { return $parm->getID() . "  " . $parm->getValue() . "  " . $parm->getType(); }, $spParms))); 
            }

            return $studentID;
        }

        //used for js remote validation validationsStudent.js  method: student_already_exists
        public function check_student_exists($params) {
            $spParms =  array(); //contains stored procedure input parms 
            array_push($spParms, new PDO_Parm("student_name", $params["student_name"], 'string')); 
            array_push($spParms, new PDO_Parm("student_phone", $params["student_phone"], 'string')); 
            array_push($spParms, new PDO_Parm("student_email", $params["student_email"], 'string')); 
            $resultSet = parent::get($this->get_dbName(), 'check_student_exists', $spParms);
            return $resultSet->fetch();
        }

        public function delete_student($params) {
            $spParms =  array(); //contains stored procedure input parms 
            array_push($spParms, new PDO_Parm("student_id", $params["student_id"], 'integer'));
            return parent::get($this->get_dbName(), 'delete_student', $spParms);
        }
    }
?>