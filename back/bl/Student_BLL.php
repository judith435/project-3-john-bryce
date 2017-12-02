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

        public function insert_student($student, &$applicationError) {

            $spParms =  array(); //contains stored procedure input parms 

            $resultSet = $this->call_sp_check_student_exists($student->getStudentName(), $student->getStudentPhone(), $student->getStudentEmail(), $spParms);
            $duplicate_student = $resultSet->fetch();
            if ($duplicate_student != false) { //student with same name, phone & email found
                $applicationError =  "student with same name, phone & email already exist - student id #" . $duplicate_student["id"];
                return;
            }
            $studentID = 0;
            array_push($spParms, new PDO_Parm("student_courses", $this->build_student_courses_parm($student), 'string'));
            $result = parent::get($this->get_dbName(), 'insert_student', $spParms);
            $studentID = $result->fetch();
            if ($studentID['new_student_id'] == -1){ //new_student_id = -1 sp insert_student failed
                $applicationError =  "adding new student failed - please contact support center"; 
                $error_handling = new ErrorHandling();
                $error_handling->LogApplicationError("error in sp insert_student:  sp parameter used: " . 
                implode(";  ", array_map(function ($parm) { return $parm->getID() . "  " . $parm->getValue() . "  " . $parm->getType(); }, $spParms))); 
            }
            return $studentID;
        }  

        public function update_student($student, &$applicationError) {

            $spParms =  array(); //contains stored procedure input parms 
            $resultSet = $this->call_sp_check_student_exists($student->getStudentName(), $student->getStudentPhone(), $student->getStudentEmail(), $spParms);
            $duplicate_student = $resultSet->fetch();
            if ($duplicate_student != false) { //student with same name, phone & email found
                //student with same name, phone & email already exist then error only if student_id different - 
                //otherwise referring to student being updated - happens when only course data for student updated
                if ($duplicate_student["id"] != $student->getStudentID()) {
                    $applicationError =  "student with same name, phone & email already exist - student id #" . $duplicate_student["id"];
                    return;
                }
            }
            $studentID = 0;
            array_unshift($spParms, new PDO_Parm("student_id", $student->getStudentID(), 'integer')); //must add student_id as first parameter
            array_push($spParms, new PDO_Parm("student_courses", $this->build_student_courses_parm($student), 'string'));
            $result = parent::get($this->get_dbName(), 'update_student', $spParms);
            $studentID = $result->fetch();
            if ($studentID['student_id'] == -1){ //student_id = -1 sp update failed
                $applicationError =  "updating student failed - please contact support center"; 
                $error_handling = new ErrorHandling();
                $error_handling->LogApplicationError("error in sp update_student:  sp parameter used: " . 
                implode(";  ", array_map(function ($parm) { return $parm->getID() . "  " . $parm->getValue() . "  " . $parm->getType(); }, $spParms))); 
            }
            return $studentID;
        }  

        public function build_student_courses_parm($student) {

            $student_courses = ""; 
            $studentCourses = $student->getStudentCourses();
            if (!empty($studentCourses)) {
                foreach($studentCourses as $course) { 
                    $student_courses .= "," . str_replace("cbCourse", "", $course);
                } 
            }
            return substr($student_courses, 1);
        }

        //used for js remote validation validationsStudent.js  method: studentAlreadyExists
        public function check_student_exists ($params) {
            $spParms =  array(); //contains stored procedure input parms 
            $resultSet = $this->call_sp_check_student_exists($params["student_name"], $params["student_phone"], $params["student_email"], $spParms);
            return $resultSet->fetch();
        }

        public function call_sp_check_student_exists($student_name, $student_phone, $student_email, &$spParms) {
            array_push($spParms, new PDO_Parm("student_name", $student_name, 'string')); 
            array_push($spParms, new PDO_Parm("student_phone", $student_phone, 'string')); 
            array_push($spParms, new PDO_Parm("student_email", $student_email, 'string')); 
            return parent::get($this->get_dbName(), 'check_student_exists', $spParms);
        }

        public function delete_student($params) {
            $spParms =  array(); //contains stored procedure input parms 
            array_push($spParms, new PDO_Parm("student_id", $params["student_id"], 'integer'));
            return parent::get($this->get_dbName(), 'delete_student', $spParms);
        }
    }
?>