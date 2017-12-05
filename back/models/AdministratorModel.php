<?php
    error_reporting(0);

    require_once '../share/Validations.php';
    
    class AdministratorModel implements JsonSerializable {

        private $adminID;
        private $adminName;
        private $roleID;
        private $roleName;
        private $adminPhone;
        private $adminEmail;
        
        function __construct($params, &$errorInInput) {
            $this->setAdministratorID
                (array_key_exists("adminID", $params) ? $params["adminID"] : 0); 
            $this->setAdministratorName($params["adminName"], $errorInInput);
            $this->setRoleID($params["roleID"], $errorInInput); 
            $this->setRoleName
                (array_key_exists("roleName", $params) ? $params["roleName"] : ""); 
            $this->setAdministratorPhone($params["adminPhone"], $errorInInput);
            $this->setAdministratorEmail($params["adminEmail"], $errorInInput);
        }  

        public function setAdministratorID($admr_id){
            $this->adminID = $admr_id;
        }

        public function setAdministratorName($admr_name, &$errorInInput){
            $validations = new Validations();
            if (!$validations->nameOK($admr_name)){
                $errorInInput .= " Administrator Name must contain at least one letter\n";
            }
            $this->adminName = rawurldecode($admr_name);
        }

        public function setRoleID($role_id, &$errorInInput){
            $validations = new Validations();
            if (!$validations->optionSelected($role_id)){
                $errorInInput .= " Please select role\n";
            }
            $this->roleID = $role_id;
        }

        public function setRoleName($role_name){
            $this->roleName = $role_name;
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
            $this->adminEmail = $email;
        }

        public function getAdministratorID(){
            return $this->adminID;
        }

        public function getAdministratorName(){
            return $this->adminName;
        }

        public function getRoleID(){
            return $this->roleID;
        }

        public function getRoleName(){
            return $this->roleName;
        }
        public function getAdministratorPhone(){
            return $this->adminPhone;
        }
        public function getAdministratorEmail(){
            return $this->adminEmail;
        }

        public function jsonSerialize() {
            return  [
                        'adminID' => $this->getAdministratorID(),
                        'adminName' => $this->getAdministratorName(),
                        'roleID' => $this->getRoleID(),
                        'roleName' => $this->getRoleName(),
                        'adminPhone' => $this->getAdministratorPhone(),
                        'adminEmail' => $this->getAdministratorEmail() 
                    ];
        }
    }
?>