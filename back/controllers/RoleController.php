<?php 
    require_once '../models/RoleModel.php';
    require_once '../bl/Role_BLL.php';
    
    class RoleController {

        function getRoles() {
                    
            $role_bll = new Role_BLL();
            $resultSet = $role_bll->get_roles();

            $allRoles = array();
            //$errorInInput will contain any problems found in data retrieved from db () creating RoleModel
            //object automatically validates the data - at this stage no further processing occurs with any faulty
            //db data
            $errorInInput = ""; 

            while ($row = $resultSet->fetch())
            {                           
                array_push($allRoles, new RoleModel(["role_id" => $row['role_id'], 
                                                     "role_name" => $row['role_name']], $errorInInput));
            }
            return $allRoles;
        }
    }
?>