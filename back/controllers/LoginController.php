<?php 
    require_once '../bl/Administrator_BLL.php';
    require_once '../models/AdministratorModel.php';
    require_once '../models/LoginModel.php';
    // require_once '../share/SuperGlobals.php';
    
    class LoginController {

        function checkUserLoggedIn() {

            if(array_key_exists('user_logged_in',$_SESSION) && !empty($_SESSION['user_logged_in'])) {
                 return $_SESSION["user_logged_in"];
            }
            return  "no" ; //no one logged in
        }

        function getAdministratorByLogin($params) {
            $login = new LoginModel($params["userEmail"], $params["userPassword"]);
            //I decide to use the Administrator_BLL as BLL for LoginController because data retrieved is admin data
            $admin_bll = new Administrator_BLL();
            $row = $admin_bll->get_administrator_by_login($login);

            if ($row != false) { //administrator found with email & password entered
                //$errorInInput will contain any problems found in data retrieved from db () creating Administrator
                //object automatically validates the data - at this stage no further processing occurs with any faulty db data
                $errorInInput = ""; 
                $administrator = new AdministratorModel(["adminID" => $row["adminID"], 
                                                         "adminName" => $row['adminName'],
                                                         "roleID" => $row['roleID'],
                                                         "roleName" => $row['roleName'],
                                                         "adminPhone" => $row['adminPhone'],
                                                         "adminEmail" => $row['adminEmail']],
                                                          $errorInInput);
                $session_name = "user_logged_in";
                $_SESSION[$session_name] = $administrator;
                //$super_global = new SuperGlobals();                                          
                //$super_global->setAdminSession($administrator);
               // $_SESSION["user_logged_in"] =  $administrator; 
                return $administrator;  
            }
            
            return "no administrator with this email and password found";
        }

        function endLogin() {
            $session_name = "user_logged_in";
            unset($_SESSION[$session_name]);

            // $super_global = new SuperGlobals();                                          
            // $super_global->deleteAdminSession();
            //unset($_SESSION['user_logged_in']);
            return "no";
        }
    }
?>