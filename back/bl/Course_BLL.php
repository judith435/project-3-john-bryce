<?php
    error_reporting(0);

    require_once 'BusinessLogicLayer.php';
    
    class Course_BLL  extends BusinessLogicLayer{

        function __construct() {
            parent::__construct('school');
        }

        public function get_courses() {
            $emptyParms = []; 
            return parent::get($this->get_dbName(), 'get_courses', $emptyParms);
        }

        public function insert_update_course($course, $method,  &$applicationError) {

            $spParms =  array(); //contains stored procedure input parms 
            array_push($spParms, new PDO_Parm("courseName", $course->getCourseName(), 'string'));

            $resultSet = parent::get($this->get_dbName(), 'check_course_exists', $spParms);
            if ($resultSet->rowCount() > 0) { // course with same name found
                $duplicate_course = $resultSet->fetch();
                if (($method == "Create") || //create: if course with same name already exist then error
                     //update: if course with same name found then error only if courseID different - otherwise referring to existing course being updated
                    ($method == "Update" && $duplicate_course["id"] != $course->getCourseID())) { 
                        $applicationError =  "course with same name already exist - course id #" . $duplicate_course["id"];
                        return;
                }
            }
            array_push($spParms, new PDO_Parm("courseDescription", $course->getCourseDescription(), 'string'));

            if ($method == "Update") {  //for update must add courseID as first parameter
                    array_unshift($spParms, new PDO_Parm("courseID", $course->getCourseID(), 'integer'));
            }
            $spName = $method == "Create" ? 'insert_course' : 'update_course';
            $courseID = 0;
            $courseID = parent::get($this->get_dbName(), $spName, $spParms);
            return $courseID->fetch();
        }

        //used for js remote validation validationsCourse.js  method: courseAlreadyExists
        public function check_course_exists($params) {
            $spParms =  array(); //contains stored procedure input parms 
            array_push($spParms, new PDO_Parm("courseName", $params["courseName"], 'string')); 
            $resultSet = parent::get($this->get_dbName(), 'check_course_exists', $spParms);
            return $resultSet->fetch();
        }

        public function delete_course($params) {
            $spParms =  array(); //contains stored procedure input parms 
            array_push($spParms, new PDO_Parm("courseID", $params["courseID"], 'integer'));
            return parent::get($this->get_dbName(), 'delete_course', $spParms);
        }
    }
?>