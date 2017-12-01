<?php 
    require_once '../bl/Administrator_BLL.php';
    require_once '../models/AdministratorModel.php';
    require_once '../models/LoginModel.php';

    class LoginController {

        function checkUserLoggedIn() {

            if(array_key_exists('user_logged_in',$_SESSION) && !empty($_SESSION['user_logged_in'])) {
                 return $_SESSION["user_logged_in"];
            }
            return  "no" ; //no one logged in
        }

        function getAdministratorByLogin($params) {
            $login = new LoginModel($params["user_email"], $params["user_password"]);
            //I decide to use the Administrator_BLL as BLL for LoginController because data retrieved is admin data
            $admin_bll = new Administrator_BLL();
            $row = $admin_bll->get_administrator_by_login($login);

            if ($row != false) { //administrator found with email & password entered
                //$errorInInput will contain any problems found in data retrieved from db () creating Administrator
                //object automatically validates the data - at this stage no further processing occurs with any faulty db data
                $errorInInput = ""; 
                $administrator = new AdministratorModel(["admin_id" => $row["admin_id"], 
                                                         "admin_name" => $row['admin_name'],
                                                         "role_id" => $row['role_id'],
                                                         "role_name" => $row['role_name'],
                                                         "admin_phone" => $row['admin_phone'],
                                                         "admin_email" => $row['admin_email']],
                                                          $errorInInput);

                $_SESSION["user_logged_in"] =  $administrator; 
                return $administrator;  
            }
            
            return "no administrator with this email and password found";
        }

        function endLogin() {
            unset($_SESSION['user_logged_in']);
            return "no";
        }
    }
?>