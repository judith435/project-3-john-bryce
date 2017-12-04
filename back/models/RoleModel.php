<?php
    error_reporting(0);
    require_once '../share/Validations.php';

    class RoleModel implements JsonSerializable {
            
        private $roleID;
        private $role_name;

        function __construct($params) {
            $this->setRoleID
             (array_key_exists("roleID", $params) ? $params["roleID"] : 0); 
            $this->setRoleName($params["role_name"]);
        }

        public function setRoleID($role_id){
            $this->roleID = $role_id;
        }

        public function setRoleName($role_name){
            $this->role_name = $role_name;
        }

        public function getRoleID(){
            return $this->roleID;
        }

        public function getRoleName(){
            return $this->role_name;
        }

        public function jsonSerialize() {
            return  [
                        'roleID' => $this->getRoleID(),
                        'role_name' => $this->getRoleName()
                    ];
        }
    }
?>