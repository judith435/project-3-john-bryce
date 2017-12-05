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
                if ($admin->getRoleName() != "owner" && $row['roleName'] == "owner" ){  
                    continue;
                } 
                array_push($allAdministrators, new AdministratorModel
                    (["adminID" => $row['adminID'], 
                    "adminName" => $row['adminName'],
                    "roleID" => $row['roleID'],
                    "roleName" => $row['roleName'],
                    "adminPhone" => $row['adminPhone'],
                    "adminEmail" => $row['adminEmail']],$errorInInput, "select"));
            }
            return $allAdministrators;
        }

        function create_update_Admin($params, $method, &$applicationError, &$ImageUploadError) {
            $admin = new AdministratorModel($params, $applicationError);
            $login = "";
            if ($method == "Create"){ // login data (password irrelevant for update - password cannot be updated)
                $login = new LoginModel($params["adminEmail"],$params["adminPassword"], $applicationError);
            }
            
            if ($applicationError != "") { //error found in data members of student object - faulty user input
                return;
            }
            $admin_bll = new Administrator_BLL();
            //insert => if student found  $applicationError will contain corresponding message and StudentApi.php will send apropriate message back to client 
            $adminID =  $admin_bll->insert_update_admin($admin, $login, $method, $applicationError);
            $new_adminID = 0;
            if ($method == "Create") {
                $new_adminID =  $adminID['new_admin_id'];         
            }

            //save admin image
            $imgHandling = new ImageHandling();
            //test if update with option to delete image (checkbox deleteImage) Delete Image on Server
            if (array_key_exists("delete_image", $params)) {
                $imgHandling->delete_image($admin->getAdministratorID(), "admin");
                return $new_adminID;
            }
            //if new admin send new admin id returned from mysql if update send adminID of updated admin ; errors
            //in image selected by user or error in attempts to save image will be written to $ImageUploadError so they can be sent back to user
            $imgHandling->save_uploaded_image(
                $method == "Create" ? $new_adminID : $admin->getAdministratorID(), 
                "admin", $ImageUploadError);
            return $new_adminID;
        }

        //used for js remote validation validationsAdministrator.js  method: adminAlreadyExists
        function getAdministratorByNameEmail($params) { 
            $admin_bll = new Administrator_BLL();
            $adminID = $admin_bll->check_admin_exists($params);
            if ($adminID == false){ //no admin found with given admin name & email
                $adminID = ["id" => -1];
            }
            return $adminID;
        }

        function delete_Admin($params) {
            $admin_bll = new Administrator_BLL();
            $admin_bll->delete_admin($params);
            //delete admin image stored in images folder
            $imgHandling = new ImageHandling();
            $imgHandling->delete_image($params["adminID"], "admin");
        }
    }
?>