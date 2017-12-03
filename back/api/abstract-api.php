<?php
    abstract class Api {
       // function foo(&$a = NULL) {
        abstract function Create($params = null);
        abstract function Read($params = null);
        abstract function Update($params  = null);
        abstract function Delete($params  = null);

        public function gateway($method, $params) {
            switch ($method) {
                case "POST":
                    return $this->Create($params);
                case "GET":
                    return  $this->Read($params);
                case "PUT":
                    return $this->Update($params);
                case "DELETE":
                    return $this->Delete($params);
            }
        }
    }
?>