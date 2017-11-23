<?php

    class ErrorHandling { 

        public static function HandleError($Error) {
            Self::Log_PHP_Error($Error);
            $response_array['status'] = 'error';  
            $response_array['message'] =  "server error please contact support center"; 
            echo json_encode($response_array);
        }

        private static function Log_PHP_Error($Error) {
            $ErrorFile = fopen("../ErrorLog.txt", "a") or die("Unable to open file!");
            $txt = "******************************************************************************************************************************" .PHP_EOL;
            fwrite($ErrorFile, $txt);
            $txt = "Error occured at " . date('Y-m-d H:i:s') .PHP_EOL;
            fwrite($ErrorFile, $txt);
            $trace = $Error->getTrace();
            $txt = "Trace:" .PHP_EOL;;
            fwrite($ErrorFile, $txt);
            foreach ($trace as $item) {
                fwrite($ErrorFile,  "file: " . $item["file"] . 
                                    " => line: " . $item["line"] . 
                                    " => function: " . $item["function"] . 
                                    " => class: " . $item["class"] . 
                                    " => type: " . $item["type"] .PHP_EOL);
            }
            //certain errors do not generate trace => handle them here
            if(empty($trace)){
                fwrite($ErrorFile,  "file: " . $Error->getFile() . 
                                    " => line: " . $Error->getLine() . 
                                    " => TraceAsString: " . $Error->getTraceAsString() .PHP_EOL);
            }

            $txt = "Message: " . $Error->getMessage() .PHP_EOL;
            fwrite($ErrorFile, $txt);
            $txt = "Code: " . $Error->getCode() .PHP_EOL;
            fwrite($ErrorFile, $txt);
            fclose($ErrorFile);        
        }

        public  static function LogApplicationError($Error) {
            
            $ErrorFile = fopen("../ErrorLog.txt", "a") or die("Unable to open file!");
            $txt = "******************************************************************************************************************************" .PHP_EOL;
            fwrite($ErrorFile, $txt);
            $txt = "Error occured at " . date('Y-m-d H:i:s') .PHP_EOL;
            fwrite($ErrorFile, $txt);
            fwrite($ErrorFile, $Error);
            fclose($ErrorFile);        
        }

    }