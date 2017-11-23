<?php
    require_once 'abstract-api.php';
    require_once '../controllers/LoginController.php';

    class LoginApi extends Api{

        function Read($params) {

            $lc = new LoginController;
            
            if (array_key_exists("user_email", $params) && array_key_exists("user_password", $params)) {
                //check login data of admin => occurs after login button is clicked on login panel => log in user (if login info ok)
                return  $lc->getAdministratorByLogin($params);
            }
            else {
                //check if any administrator is logged in => used in login_logout.login() (called by index.html main.js) to determine if 
                //login panel should or navigation bar with logged in admin's data should be displayed
                return  $lc->checkUserLoggedIn(); 
            }
        }

        function Create($params) {}

        function Update($params) {}

        function Delete($params) { //user clicked logout link

            $lc = new LoginController;
            return  $lc->endLogin();
        }
    }
?>