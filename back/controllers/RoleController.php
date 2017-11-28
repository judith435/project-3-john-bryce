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
                array_push($allRoles, new RoleModel(["role_id" => $row['role_id'], 
                                                     "role_name" => $row['role_name']]));
            }
            return $allRoles;
        }
    }
?>