<?php
    class PDO_Parm { //class containing stored procedure parameters

        private $identity;
        private $value;
        private $type;

        public function __construct($identity, $value, $type){
            $this->setID($identity);
            $this->setValue($value);
            $this->setType($type);

        }

        public function getID(){
            return $this->identity;
        }

        public function getValue(){
            return $this->value;
        }

        public function getType(){
            return $this->type;
        }

        public function setID($identity){
            $this->identity = $identity;
        }

        public function setValue($value){
            $this->value = $value;
        }

        public function setType($type){
            $types = [
                        "integer" => 1,
                        "string" => 2,
                        "boolean" => 5,
            ];
            $this->type = $types[$type];
        }
    }
?>