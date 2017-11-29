<?php
    error_reporting(0);

    require_once '../dal/Connection.php';
    require_once '../dal/PDO_Parm.php';

    class BusinessLogicLayer {

        private $dbName;
        
        function __construct($dbName) {
            $this->set_dbName($dbName);
        }

        public function set_dbName($dbName){
            $this->dbName = $dbName;
        }

        public function get_dbName(){
            return $this->dbName;
        }
        
        public function update($database, $spName, $SP_parms) {
            $con = new Connection($database);  
            $con->executeSP($spName, $SP_parms);
        }

        public function get($database, $spName, $SP_parms) {
            $con = new Connection($database);  
            return $con->executeSP($spName, $SP_parms);
        }
    }
?>