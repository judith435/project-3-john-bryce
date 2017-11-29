<?php
    require_once 'abstract-api.php';
    require_once '../controllers/RoleController.php';

    class RoleApi extends Api{

        function Read($params) { //used to fill role combo on administrator's CUD panel
            $roleCtrl = new RoleController;
            return  $roleCtrl->getRoles(); 
        }

        function Create($params) {}
        function Update($params) {}
        function Delete($params) {}
    }
?>