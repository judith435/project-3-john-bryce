<?php
    error_reporting(0);

    require_once 'BusinessLogicLayer.php';
    
    class Role_BLL  extends BusinessLogicLayer{

        function __construct() {
            parent::__construct('school');
        }
    
        public function get_roles() {
            $emptyParms = []; 
            return parent::get($this->get_dbName(), 'get_roles', $emptyParms);
        }
    }
?>