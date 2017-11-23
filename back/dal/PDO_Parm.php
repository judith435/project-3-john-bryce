<?php
    class PDO_Parm { 

        private $id;
        private $value;
        private $type;

        public function __construct($id, $value, $type){
            $this->setID($id);
            $this->setValue($value);
            $this->setType($type);

        }

        public function getID(){
            return $this->id;
        }

        public function getValue(){
            return $this->value;
        }

        public function getType(){
            return $this->type;
        }

        public function setID($id){
            $this->id = $id;
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