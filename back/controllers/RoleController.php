<?php 
    require_once '../models/RoleModel.php';
    require_once '../bl/Role_BLL.php';
    
    class RoleController {

        function getRoles() {
                    
            $role_bll = new Role_BLL();
            $resultSet = $role_bll->get_roles();

            $allRoles = array();
            while ($row = $resultSet->fetch())
            {                           
                array_push($allRoles, new RoleModel(["roleID" => $row['roleID'], 
                                                     "roleName" => $row['roleName']]));
            }
            return $allRoles;
        }
    }
?>