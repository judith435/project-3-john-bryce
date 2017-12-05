<?php
    error_reporting(0);

    require_once '../share/Validations.php';
    
    class StudentModel implements JsonSerializable {

        private $studentID;
        private $studentName;
        private $studentPhone;
        private $studentEmail;
        private $studentCourses = array();
     
        function __construct($params, &$errorInInput, $action) {
            $this->setStudentID
                (array_key_exists("studentID", $params) ? $params["studentID"] : 0); 
            $this->setStudentName($params["studentName"], $errorInInput);
            $this->setStudentPhone
                (array_key_exists("studentPhone", $params) ? $params["studentPhone"] : "", $errorInInput); 
            $this->setStudentEmail
                (array_key_exists("studentEmail", $params) ? $params["studentEmail"] : "", $errorInInput); 
            //different setters required update: data comes in form of cbCourse + courseID for every course selected from checkboxlist in html    
            //select data comes from sp in form of concatnated string containing all courses
            if ($action == "select") {    
                $this->setStudentCourses_select($params["studentCourses"]);
            } 
            
            if ($action == "update") { 
                $this->setStudentCourses_update($params);
            }
        }  

        public function setStudentID($stdnt_id){
            $this->studentID = $stdnt_id;
        }

        public function setStudentName($stdnt_name, &$errorInInput){
            $validations = new Validations();
            if (!$validations->nameOK($stdnt_name)){
                $errorInInput .= " Student Name must contain at least one letter\n";
            }
            $this->studentName = rawurldecode($stdnt_name);
        }

        public function setStudentPhone($stdnt_phone, &$errorInInput){
            $validations = new Validations();
            if (!$validations->phoneOK($stdnt_phone)){
                $errorInInput .= " Student Phone not a valid phone number\n";
            }
            $this->studentPhone = rawurldecode($stdnt_phone);
        }

        public function setStudentEmail($stdnt_email,  &$errorInInput){
            $validations = new Validations();
            $email = rawurldecode($stdnt_email);
            if (!$validations->emailOK($email)){
                $errorInInput .= " Student Email not a valid email\n";
            }
            $this->studentEmail = $email;
        }

        public function setStudentCourses_update($params){
            $courses = preg_grep('/^cbCourse/', array_keys($params));
            $this->studentCourses = $courses;
        }

        public function setStudentCourses_select($stdnt_crs){
            $this->studentCourses = $stdnt_crs;
        }
        
        public function getStudentID(){
            return $this->studentID;
        }

        public function getStudentName(){
            return $this->studentName;
        }

        public function getStudentPhone(){
            return $this->studentPhone;
        }

        public function getStudentEmail(){
            return $this->studentEmail;
        }

        public function getStudentCourses(){
            return $this->studentCourses;
        }

        public function jsonSerialize() {
            return  [
                        'studentID' => $this->getStudentID(),
                        'studentName' => $this->getStudentName(),
                        'studentPhone' => $this->getStudentPhone(),
                        'studentEmail' => $this->getStudentEmail(),
                        'studentCourses' => $this->getStudentCourses()
                    ];
        }
    }
?>