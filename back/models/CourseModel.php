<?php
    error_reporting(0);

    require_once '../share/Validations.php';
    
    class CourseModel implements JsonSerializable {

        private $courseID;
        private $courseName;
        private $courseDescription;
        private $number_of_students_for_course;
        private $student_ids;
        
        function __construct($params, &$errorInInput) {
            $this->setCourseID
                (array_key_exists("courseID", $params) ? $params["courseID"] : 0); 
            $this->setCourseName($params["courseName"], $errorInInput);
            $this->setCourseDescription
                (array_key_exists("courseDescription", $params) ? $params["courseDescription"] : "", $errorInInput); 
            //always assigng empty string -> this property is used for course retrival NOT course update     
            $this->setStudentsNumberForCourse
               (array_key_exists("number_of_students_for_course", $params) ? $params["number_of_students_for_course"] : "");    
            $this->setStudentIDs
               (array_key_exists("student_ids", $params) ? $params["student_ids"] : "");      
        }  

        public function setCourseID($crs_id){
            $this->courseID = $crs_id;
        }

        public function setCourseName($crs_name, &$errorInInput){
            $validations = new Validations();
            if (!$validations->nameOK($crs_name)){
                $errorInInput .= " Course Name must contain at least one letter\n";
            }
            $this->courseName = rawurldecode($crs_name);
        }

        public function setCourseDescription($crs_description, &$errorInInput){
            $validations = new Validations();
            if (!$validations->nameOK($crs_description)){
                $errorInInput .= " Course Description must contain at least one letter\n";
            }
            $this->courseDescription = rawurldecode($crs_description);
        }

        public function setStudentsNumberForCourse($stdnt_crs){
            $this->number_of_students_for_course = $stdnt_crs;
        }

        public function setStudentIDs($stdnt_ids){
            $this->student_ids = $stdnt_ids;
        }

        public function getCourseID(){
            return $this->courseID;
        }

        public function getCourseName(){
            return $this->courseName;
        }

        public function getCourseDescription(){
            return $this->courseDescription;
        }

        public function getStudentsNumberForCourse(){
            return $this->number_of_students_for_course;
        }

        public function getStudentIDs(){
            return $this->student_ids;
        }

        public function jsonSerialize() {
            return  [
                        'courseID' => $this->getCourseID(),
                        'courseName' => $this->getCourseName(),
                        'courseDescription' => $this->getCourseDescription(),
                        'number_of_students_for_course' => $this->getStudentsNumberForCourse(),
                        'student_ids' => $this->getStudentIDs()
                    ];
        }
    }
?>