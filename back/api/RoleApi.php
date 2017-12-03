<?php
    require_once 'abstract-api.php';
    require_once '../controllers/RoleController.php';

    class RoleApi extends Api{

        function Read($params = null) { //used to fill role combo on administrator's CUD panel
            $roleCtrl = new RoleController;
            return  $roleCtrl->getRoles(); 
        }

        function Create($params = null) {}
        function Update($params = null) {}
        function Delete($params = null) {}
    }
?>