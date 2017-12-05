<?php
    error_reporting(0);
    require_once '../share/Validations.php';

    class RoleModel implements JsonSerializable {
            
        private $roleID;
        private $roleName;

        function __construct($params) {
            $this->setRoleID
             (array_key_exists("roleID", $params) ? $params["roleID"] : 0); 
            $this->setRoleName($params["roleName"]);
        }

        public function setRoleID($role_id){
            $this->roleID = $role_id;
        }

        public function setRoleName($role_name){
            $this->roleName = $role_name;
        }

        public function getRoleID(){
            return $this->roleID;
        }

        public function getRoleName(){
            return $this->roleName;
        }

        public function jsonSerialize() {
            return  [
                        'roleID' => $this->getRoleID(),
                        'roleName' => $this->getRoleName()
                    ];
        }
    }
?>