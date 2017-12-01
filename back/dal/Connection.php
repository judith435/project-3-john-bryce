<?php
    error_reporting(0);
    
    class Connection {

        private $host = '127.0.0.1';
        private $database;
        private $user = 'root';
        private $pass = '';
        private $charset = 'utf8';
        private $dsn;
        private $opt = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        public function __construct($data_base) {
            $this->setDB($data_base);
            $this->dsn = "mysql:host=" . $this->host . 
                         ";dbname=" . $this->getDB() .
                         ";charset=" .$this->charset."";
        }

        //function should be private so that outside hackers cannot get datatbase info
        private function getDB(){
            return $this->database;
        }

        //function should be private so that outside hackers cannot change datatbase access
        private function setDB($data_base){
            $this->database = $data_base;
        }

        //generic function to execute any mysql statement
        public function executeStatement($query, $parms) {
            $pdo = new PDO($this->dsn, $this->user, $this->pass, $this->opt);
            $stmt = $pdo->prepare($query);
            $stmt->execute($parms);
            return $stmt;
        }

        //generic function to execute any mysql stored procedure
        public function executeSP($stored_procedure, $parms) {   
            $pdo = new PDO($this->dsn, $this->user, $this->pass, $this->opt);
            $parmList = '(';
            foreach ($parms as  $parm) {  
                $parmList .= ':' . $parm->getID() . ',';
            }
            $parmList = rtrim($parmList, ',');
            $parmList .= ')';
            $sql = 'CALL ' . $stored_procedure . $parmList;
            $stmt = $pdo->prepare($sql);
            foreach ($parms as  $parm) { 
                $stmt->bindValue(':' . $parm->getID() , $parm->getValue(), $parm->getType());
            }
            $stmt->execute();
            return $stmt;
         }
    } 
?>