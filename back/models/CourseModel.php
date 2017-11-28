<?php
    error_reporting(0);

    require_once '../share/Validations.php';
    
    class CourseModel implements JsonSerializable {

        private $course_id;
        private $course_name;
        private $course_description;
        private $number_of_students_for_course;
        private $student_ids;
        
        function __construct($params, &$errorInInput) {
            $this->setCourseID
                (array_key_exists("course_id", $params) ? $params["course_id"] : 0); 
            $this->setCourseName($params["course_name"], $errorInInput);
            $this->setCourseDescription
                (array_key_exists("course_description", $params) ? $params["course_description"] : "", $errorInInput); 
            //always assigng empty string -> this property is used for course retrival NOT course update     
            $this->setStudentsNumberForCourse
               (array_key_exists("number_of_students_for_course", $params) ? $params["number_of_students_for_course"] : "");    
            $this->setStudentIDs
               (array_key_exists("student_ids", $params) ? $params["student_ids"] : "");      
        }  

        public function setCourseID($crs_id){
            $this->course_id = $crs_id;
        }

        public function setCourseName($crs_name, &$errorInInput){
            if (!Validations::nameOK($crs_name)){
                $errorInInput .= " Course Name must contain at least one letter\n";
            }
            $this->course_name = rawurldecode($crs_name);
        }

        public function setCourseDescription($crs_description, &$errorInInput){
            if (!Validations::nameOK($crs_description)){
                $errorInInput .= " Course Description must contain at least one letter\n";
            }
            $this->course_description = rawurldecode($crs_description);
        }

        public function setStudentsNumberForCourse($stdnt_crs){
            $this->number_of_students_for_course = $stdnt_crs;
        }

        public function setStudentIDs($stdnt_ids){
            $this->student_ids = $stdnt_ids;
        }

        public function getCourseID(){
            return $this->course_id;
        }

        public function getCourseName(){
            return $this->course_name;
        }

        public function getCourseDescription(){
            return $this->course_description;
        }

        public function getStudentsNumberForCourse(){
            return $this->number_of_students_for_course;
        }

        public function getStudentIDs(){
            return $this->student_ids;
        }

        public function jsonSerialize() {
            return  [
                        'course_id' => $this->getCourseID(),
                        'course_name' => $this->getCourseName(),
                        'course_description' => $this->getCourseDescription(),
                        'number_of_students_for_course' => $this->getStudentsNumberForCourse(),
                        'student_ids' => $this->getStudentIDs()
                    ];
        }
    }
?>