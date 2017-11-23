<?php

    class PasswordHandler {
        private $salt;

        function __construct()
        {
            $this->salt = "gunibush"; //my son's nickname when he was young
        }
        public function getHash($plainPassword) {
            return MD5($this->salt.$plainPassword);
        }
    }