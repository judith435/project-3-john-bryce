<?php 
    require_once '../bl/Administrator_BLL.php';
    require_once '../models/AdministratorModel.php';
    require_once '../models/LoginModel.php';
    
    class LoginController {

        function checkUserLoggedIn() {

            if(array_key_exists('user_logged_in',$_SESSION) && !empty($_SESSION['user_logged_in'])) {
                $response['loginStatus'] = 'user logged in';  
                return $response;
            }
            $response['loginStatus'] = 'no one logged in';  
            return $response;
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
                $_SESSION["user_logged_in"] = $administrator;

                $response_array['loginStatus'] = 'admin found';  
                $response_array['adminDetails'] = $administrator;
                return $response_array;
            }
            $response_array['loginStatus'] = 'no administrator with this email and password found';  
            return $response_array;
        }

        function endLogin() {
            unset($_SESSION['user_logged_in']);
            $response['loginStatus'] = 'no one logged in';  
            return $response;
        }
    }
?>