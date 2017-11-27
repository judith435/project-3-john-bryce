<?php
    error_reporting(0);

    require_once '../share/Validations.php';
    
    class AdministratorModel implements JsonSerializable {

        private $admin_id;
        private $admin_name;
        private $role_id;
        private $role_name;
        private $admin_phone;
        private $admin_email;
        
        function __construct($params, &$errorInInput) {
            $this->setAdministratorID
                (array_key_exists("admin_id", $params) ? $params["admin_id"] : 0); 
            $this->setAdministratorName($params["admin_name"], $errorInInput);
            $this->setRoleID($params["role_id"], $errorInInput); 
            $this->setRoleName
                (array_key_exists("role_name", $params) ? $params["role_name"] : ""); 
            $this->setAdministratorPhone($params["admin_phone"], $errorInInput);
            $this->setAdministratorEmail($params["admin_email"], $errorInInput);
        }  

        public function setAdministratorID($admr_id){
            $this->admin_id = $admr_id;
        }

        public function setAdministratorName($admr_name, &$errorInInput){
            if (!Validations::nameOK($admr_name)){
                $errorInInput .= " Administrator Name must contain at least one letter\n";
            }
            $this->admin_name = rawurldecode($admr_name);
        }

        public function setRoleID($role_id, &$errorInInput){
            if (!Validations::optionSelected($role_id)){
                $errorInInput .= " Please select role\n";
            }
            $this->role_id = $role_id;
        }

        public function setRoleName($role_name){
            $this->role_name = $role_name;
        }

        public function setAdministratorPhone($admr_ph, &$errorInInput){
            if (!Validations::phoneOK($admr_ph)){
                $errorInInput .= " Administrator Phone not a valid phone number\n";
            }
            $this->admin_phone = rawurldecode($admr_ph);
        }

        public function setAdministratorEmail($admr_e, &$errorInInput){
            $email = rawurldecode($admr_e);
            if (!Validations::emailOK($email)){
                $errorInInput .= " Administrator Email not a valid email\n";
            }
            $this->admin_email = $email;
        }

        public function getAdministratorID(){
            return $this->admin_id;
        }

        public function getAdministratorName(){
            return $this->admin_name;
        }

        public function getRoleID(){
            return $this->role_id;
        }

        public function getRoleName(){
            return $this->role_name;
        }
        public function getAdministratorPhone(){
            return $this->admin_phone;
        }
        public function getAdministratorEmail(){
            return $this->admin_email;
        }

        public function jsonSerialize() {
            return  [
                        'admin_id' => $this->getAdministratorID(),
                        'admin_name' => $this->getAdministratorName(),
                        'role_id' => $this->getRoleID(),
                        'role_name' => $this->getRoleName(),
                        'admin_phone' => $this->getAdministratorPhone(),
                        'admin_email' => $this->getAdministratorEmail() 
                    ];
        }
    }
?>