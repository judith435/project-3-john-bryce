<?php

    class Validations { 

        public static function nameOK($name) {
            if (!preg_match("/[a-z]/i", $name)) //name must contain at least one letter
            {
                return false;
            }
            return true;
        }

        public static function optionSelected($option) {
            if ($option == "")
            {
                return false;
            }
            return true;
        }

        public static function phoneOK($phone) {
            if (!preg_match("/\d/", $phone)) //name phone contain at least one number
            {
                return false;
            }
            return true;
        }

        public static function emailOK($email) {
            return filter_var($email, FILTER_VALIDATE_EMAIL);
        }
    }
?>