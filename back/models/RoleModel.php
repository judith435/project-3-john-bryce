<?php
    error_reporting(0);
    require_once '../share/Validations.php';

    class RoleModel implements JsonSerializable {
            
        private $role_id;
        private $role_name;

        function __construct($params, &$errorInInput) {
            $this->setRoleID
             (array_key_exists("role_id", $params) ? $params["role_id"] : 0); 
            $this->setRoleName($params["role_name"], $errorInInput);
        }

        public function setRoleID($role_id){
            $this->role_id = $role_id;
        }

        public function setRoleName($role_name, &$errorInInput){
            $this->role_name = $role_name;
        }

        public function getRoleID(){
            return $this->role_id;
        }

        public function getRoleName(){
            return $this->role_name;
        }

        public function jsonSerialize() {
            return  [
                        'role_id' => $this->getRoleID(),
                        'role_name' => $this->getRoleName()
                    ];
        }
    }
?>