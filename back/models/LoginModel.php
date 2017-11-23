<?php
    error_reporting(0);

    require_once '../share/PasswordHandler.php';
    
    //used to send administrator login info to db to check if such a user exists  and for new administrator 
    //to encrypt his password  no jsonserialize defined LoginModel data is NEVER  sent to client
    class LoginModel{ 
        private $login_email;
        private $login_password;
        

        function __construct($email, $password) {
            $this->setLoginEmail($email);
            $this->setLoginPassword($password);
        }  

        public function setLoginEmail($login_e){
            $this->login_email = rawurldecode($login_e);
        }

        public function setLoginPassword($login_pwd){
            $pw = new PasswordHandler();
            $this->login_password = $pw->getHash($login_pwd);
        }

        public function getLoginEmail(){
            return $this->login_email;
        }

        public function getLoginPassword(){
            return $this->login_password;
        }
    }
?>