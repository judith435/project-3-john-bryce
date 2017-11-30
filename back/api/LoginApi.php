<?php
    require_once 'abstract-api.php';
    require_once '../controllers/LoginController.php';

    class LoginApi extends Api{

        function Read($params) {

            $loginCtrl = new LoginController;
            
            if (array_key_exists("user_email", $params) && array_key_exists("user_password", $params)) {
                //check login data of admin => occurs after login button is clicked on login panel => log in user (if login info ok)
                return  $loginCtrl->getAdministratorByLogin($params);
            }
            //check if any administrator is logged in => used in loginHandling.getLoginStatus() (called by index.html main.js) to determine if 
            //login panel should or navigation bar with logged in admin's data should be displayed
            return  $loginCtrl->checkUserLoggedIn(); 
        }

        function Create($params) {}

        function Update($params) {}

        function Delete($params) { //user clicked logout link

            $loginCtrl = new LoginController;
            return  $loginCtrl->endLogin();
        }
    }
?>