<?php
    error_reporting(0);

    require_once 'BusinessLogicLayer.php';
    
    class Administrator_BLL  extends BusinessLogicLayer{

        function __construct() {
            parent::__construct('school');
        }

        public function get_administrators() {
            $emptyParms = []; 
            return parent::get($this->get_dbName(), 'get_administrators', $emptyParms);
        }
        
        public function get_administrator_by_login($login) {
            $spParms =  array(); //contains stored procedure input parms 
            array_push($spParms, new PDO_Parm("email", $login->getLoginEmail(), 'string')); 
            array_push($spParms, new PDO_Parm("password", $login->getLoginPassword(), 'string'));
            $resultSet = parent::get($this->get_dbName(), 'get_administrator_by_login', $spParms);
            return $resultSet->fetch();

        }

        //used for js remote validation validationsAdministrator.js  method: adminAlreadyExists
        public function check_admin_exists($params) {
            $spParms =  array(); //contains stored procedure input parms 
            array_push($spParms, new PDO_Parm("adminName", $params["adminName"], 'string')); 
            array_push($spParms, new PDO_Parm("adminEmail", $params["adminEmail"], 'string')); 
            $resultSet = parent::get($this->get_dbName(), 'check_admin_exists', $spParms);
            return $resultSet->fetch();
        }

        public function insert_update_admin($admin, $login, $method, &$applicationError) {

            $spParms =  array(); //contains stored procedure input parms 
            array_push($spParms, new PDO_Parm("adminName", $admin->getAdministratorName(), 'string'));  
            array_push($spParms, new PDO_Parm("adminEmail", $admin->getAdministratorEmail(), 'string'));  

            $resultSet = parent::get($this->get_dbName(), 'check_admin_exists', $spParms);
            if ($resultSet->rowCount() > 0) { // admin with same name & email found
                $duplicate_admin = $resultSet->fetch();
                if (($method == "Create") || //create: if admin with same name & email already exist then error
                    //update: if admin with same name & email already exist then error only if adminID different - otherwise referring to existing admin
                    ($method == "Update" && $duplicate_admin["id"] != $admin->getAdministratorID())) { 
                         $applicationError =  "administrator with same name & email found - admin id #" . $duplicate_admin["id"];
                    return;
                }
            }

            array_push($spParms, new PDO_Parm("roleID", $admin->getRoleID(), 'integer')); 
            array_push($spParms, new PDO_Parm("adminPhone", $admin->getAdministratorPhone(), 'string')); 
            
            if ($method == "Update") {  //for update must add adminID as first parameter
                array_unshift($spParms, new PDO_Parm("adminID", $admin->getAdministratorID(), 'integer'));
            }

            if ($method == "Create") { //for insert add password => irrelevant for update password cannot be updated
                array_push($spParms, new PDO_Parm("adminPassword", $login->getLoginPassword(), 'string')); 
            }
            
            $spName = $method == "Create" ? 'insert_administrator' : 'update_administrator';

            $adminID = parent::get($this->get_dbName(), $spName, $spParms);
            return $adminID->fetch();
        }

        public function delete_admin($params) {
            $spParms =  array(); //contains stored procedure input parms 
            array_push($spParms, new PDO_Parm("adminID", $params["adminID"], 'integer'));
            return parent::get($this->get_dbName(), 'delete_administrator', $spParms);
        }
    }
?>