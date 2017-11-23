<?php 
    require_once '../bl/Administrator_BLL.php';
    require_once '../models/AdministratorModel.php';

    class AdministratorController {

        function getAll_Administrators() {
            $admin_bll = new Administrator_BLL();
            $resultSet = $admin_bll->get_administrators();

            $allAdministrators = array();
            //$errorInInput will contain any problems found in data retrieved from db () creating AdministratorModel
            //object automatically validates the data - at this stage no further processing occurs with any faulty
            //db data
            $errorInInput = ""; 
            $admin = $_SESSION["user_logged_in"];
            while ($row = $resultSet->fetch())
            {   //if admin not owner skip owner admin data => admin manager may not see admin owner data        
                if ($admin->getRoleName() != "owner" && $row['role_name'] == "owner" ){  
                    continue;
                } 
                array_push($allAdministrators, new AdministratorModel
                    (["admin_id" => $row['admin_id'], 
                    "admin_name" => $row['admin_name'],
                    "role_id" => $row['role_id'],
                    "role_name" => $row['role_name'],
                    "admin_phone" => $row['admin_phone'],
                    "admin_email" => $row['admin_email']],$errorInInput, "select"));
            }
            return $allAdministrators;
        }

        function create_update_Admin($params, $method, &$applicationError, &$ImageUploadError) {
            $admin = new AdministratorModel($params, $applicationError);
            $login = "";
            if ($method == "Create"){ // login data (password irrelevant for update - password cannot be updated)
                $login = new LoginModel($params["admin_email"],$params["admin_password"], $applicationError);
            }
            if ($applicationError != "") { //error found in data members of student object - faulty user input
                return;
            }
            $admin_bll = new Administrator_BLL();
            //insert => if student already exists  $applicationError will contain corresponding message and StudentApi.php will send apropriate message back to client 
            $adminID =  $admin_bll->insert_update_admin($admin, $login, $method, $applicationError);
            if ($method == "Create"){
                $new_adminID =  $adminID['new_admin_id'];         
            }
            else {
                $new_adminID = 0;
            }

            //save student image
            $ih = new ImageHandling();
            //test if update with option to delete image (checkbox deleteImage) Delete Image on Server
            if ($method == "Update" && array_key_exists("delete_image", $params)) {
                $ih->delete_image($params["admin_id"], "admin");
            }
            else {
                //if new admin send new admin id returned from mysql if update send admin_id of updated admin ; errors
                //in image selected by user or error in attempts to save image will be written to $ImageUploadError so they can be sent back to user
                $ih->save_uploaded_image($method, $method == "Create" ? $new_adminID :  $params["admin_id"], "admin", $ImageUploadError);
            }
            return $new_adminID;
        }

        //used for js remote validation validationsAdministrator.js  method: admin_already_exists
        function getAdministratorByNameEmail($params) { 
            $admin_bll = new Administrator_BLL();
            $admin_id = $admin_bll->check_admin_exists($params);
            if ($admin_id == false){ //no admin found with given admin name & email
                $admin_id = ["id" => -1];
            }
            return $admin_id;
        }

        function delete_Admin($params) {
            $admin_bll = new Administrator_BLL();
            $admin_bll->delete_admin($params);
            //delete admin image stored in images folder
            $ih = new ImageHandling();
            $ih->delete_image($params["admin_id"], "admin");
        }
    }
?>