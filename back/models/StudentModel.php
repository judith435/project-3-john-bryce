<?php
    error_reporting(0);

    require_once '../share/Validations.php';
    
    class StudentModel implements JsonSerializable {

        private $student_id;
        private $student_name;
        private $student_phone;
        private $student_email;
        private $student_courses = array();
     
        function __construct($params, &$errorInInput, $action) {
            $this->setStudentID
                (array_key_exists("student_id", $params) ? $params["student_id"] : 0); 
            $this->setStudentName($params["student_name"], $errorInInput);
            $this->setStudentPhone
                (array_key_exists("student_phone", $params) ? $params["student_phone"] : "", $errorInInput); 
            $this->setStudentEmail
                (array_key_exists("student_email", $params) ? $params["student_email"] : "", $errorInInput); 
            //different setters required update: data comes in form of cbCourse + courseID for every course selected from checkboxlist in html    
            //select data comes from sp in form of concatnated string containing all courses
            if ($action == "select") {    
                $this->setStudentCourses_select($params["student_courses"]);
            } 
            
            if ($action == "update") { 
                $this->setStudentCourses_update($params);
            }
        }  

        public function setStudentID($stdnt_id){
            $this->student_id = $stdnt_id;
        }

        public function setStudentName($stdnt_name, &$errorInInput){
            $validations = new Validations();
            if (!$validations->nameOK($stdnt_name)){
                $errorInInput .= " Student Name must contain at least one letter\n";
            }
            $this->student_name = rawurldecode($stdnt_name);
        }

        public function setStudentPhone($stdnt_phone, &$errorInInput){
            $validations = new Validations();
            if (!$validations->phoneOK($stdnt_phone)){
                $errorInInput .= " Student Phone not a valid phone number\n";
            }
            $this->student_phone = rawurldecode($stdnt_phone);
        }

        public function setStudentEmail($stdnt_email,  &$errorInInput){
            $validations = new Validations();
            $email = rawurldecode($stdnt_email);
            if (!$validations->emailOK($email)){
                $errorInInput .= " Student Email not a valid email\n";
            }
            $this->student_email = $email;
        }

        public function setStudentCourses_update($params){
            $courses = preg_grep('/^cbCourse/', array_keys($params));
            $this->student_courses = $courses;
        }

        public function setStudentCourses_select($stdnt_crs){
            $this->student_courses = $stdnt_crs;
        }
        
        public function getStudentID(){
            return $this->student_id;
        }

        public function getStudentName(){
            return $this->student_name;
        }

        public function getStudentPhone(){
            return $this->student_phone;
        }

        public function getStudentEmail(){
            return $this->student_email;
        }

        public function getStudentCourses(){
            return $this->student_courses;
        }

        public function jsonSerialize() {
            return  [
                        'student_id' => $this->getStudentID(),
                        'student_name' => $this->getStudentName(),
                        'student_phone' => $this->getStudentPhone(),
                        'student_email' => $this->getStudentEmail(),
                        'student_courses' => $this->getStudentCourses()
                    ];
        }
    }
?>