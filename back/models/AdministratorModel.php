<?php
    error_reporting(0);

    require_once '../share/Validations.php';
    
    class AdministratorModel implements JsonSerializable {

        private $adminID;
        private $admin_name;
        private $role_id;
        private $role_name;
        private $adminPhone;
        private $admin_email;
        
        function __construct($params, &$errorInInput) {
            $this->setAdministratorID
                (array_key_exists("adminID", $params) ? $params["adminID"] : 0); 
            $this->setAdministratorName($params["admin_name"], $errorInInput);
            $this->setRoleID($params["role_id"], $errorInInput); 
            $this->setRoleName
                (array_key_exists("role_name", $params) ? $params["role_name"] : ""); 
            $this->setAdministratorPhone($params["adminPhone"], $errorInInput);
            $this->setAdministratorEmail($params["admin_email"], $errorInInput);
        }  

        public function setAdministratorID($admr_id){
            $this->adminID = $admr_id;
        }

        public function setAdministratorName($admr_name, &$errorInInput){
            $validations = new Validations();
            if (!$validations->nameOK($admr_name)){
                $errorInInput .= " Administrator Name must contain at least one letter\n";
            }
            $this->admin_name = rawurldecode($admr_name);
        }

        public function setRoleID($role_id, &$errorInInput){
            $validations = new Validations();
            if (!$validations->optionSelected($role_id)){
                $errorInInput .= " Please select role\n";
            }
            $this->role_id = $role_id;
        }

        public function setRoleName($role_name){
            $this->role_name = $role_name;
        }

        public function setAdministratorPhone($admr_ph, &$errorInInput){
            $validations = new Validations();
            if (!$validations->phoneOK($admr_ph)){
                $errorInInput .= " Administrator Phone not a valid phone number\n";
            }
            $this->adminPhone = rawurldecode($admr_ph);
        }

        public function setAdministratorEmail($admr_e, &$errorInInput){
            $validations = new Validations();
            $email = rawurldecode($admr_e);
            if (!$validations->emailOK($email)){
                $errorInInput .= " Administrator Email not a valid email\n";
            }
            $this->admin_email = $email;
        }

        public function getAdministratorID(){
            return $this->adminID;
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
            return $this->adminPhone;
        }
        public function getAdministratorEmail(){
            return $this->admin_email;
        }

        public function jsonSerialize() {
            return  [
                        'adminID' => $this->getAdministratorID(),
                        'admin_name' => $this->getAdministratorName(),
                        'role_id' => $this->getRoleID(),
                        'role_name' => $this->getRoleName(),
                        'adminPhone' => $this->getAdministratorPhone(),
                        'admin_email' => $this->getAdministratorEmail() 
                    ];
        }
    }
?>