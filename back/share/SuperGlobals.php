<?php
class SuperGlobals
{

    public function setAdminSession($administrator) {
        $_SESSION["user_logged_in"] =  $administrator; 
        // $name = $_POST['foo'];
    }

    public function getAdminSession() {
        return $_SESSION["user_logged_in"]; 
    }

    public function deleteAdminSession() {
        unset($_SESSION['user_logged_in']);
    }

}

// class Foo {
//     public function bar() {
//         $name = $_POST['foo'];
//     }
// }