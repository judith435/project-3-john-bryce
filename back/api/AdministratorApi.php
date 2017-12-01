<?php
    require_once 'abstract-api.php';
    require_once '../controllers/AdministratorController.php';

    class AdministratorApi extends Api{

        function Read($params) {

            $adminCtrl = new AdministratorController;
            //used to check if admin by same name & phone found: js remote validation validationsAdministrator.js  method: adminAlreadyExists
            if (array_key_exists("admin_name", $params) && array_key_exists("admin_email", $params)) {
                return  $adminCtrl->getAdministratorByNameEmail($params);
            }

            //get all administrators for side menu administrators 
            return  $adminCtrl->getAll_Administrators();
        }

        function Create($params) {
            if ($params["role_name"] == "owner")
            {
                $response_array['status'] = 'error'; 
                $response_array['action'] = 'Create administrator';
                $response_array['message'] = 'attempt to create new owner'; 
                return $response_array;
            }
            return $this->create_update($params, "Create");  
        }

        function Update($params) {
            //check if administrator is trying to change his role / or create new owner /or change other admins role to owner 
            //if yes stop update and returne error message
            $admin = $_SESSION["user_logged_in"];
            if (($admin->getRoleID() !=   $params["role_id"] && 
                 $admin->getAdministratorID() ==  $params["admin_id"]) ||
                ($params["role_name"] == "owner" ))
            {
                $response_array['status'] = 'error'; 
                $response_array['action'] = 'Update administrator';
                $response_array['message'] = 'manager tried to change his role or' . 
                  ' someone tried to change other administator"s role to owner'; 
                return $response_array;
            }

            return $this->create_update($params, "Update");  
        }

        function Delete($params) {
            //check if administrator is trying to delete himself - if yes stop delete and return error message
            $admin = $_SESSION["user_logged_in"];
            if ($admin->getAdministratorID() ==   $params["admin_id"] ){
                $response_array['status'] = 'error'; 
                $response_array['action'] = 'Delete administrator';
                $response_array['message'] = 'administrator tried to delete himself'; 
                return $response_array;
            }
            $adminCtrl = new AdministratorController;
            $adminCtrl->delete_Admin($params);
            $response_array['status'] = 'ok'; 
            $response_array['action'] = 'Delete administrator';
            $response_array['message'] = 'administrator deleted successfully'; 
            return $response_array;
        }


        function create_update($params, $function) {
            //used to return the following kind of errors to client: errors in input data, creating admin that found etc. 
            $applicationError = "";

            //used to return msg to client about errors in upload this may be error in image itself: admin image  size & file type or in upload attempt
            // => must be handled separately from $applicationError
            //insert/update admin can be successfull but there might be problem with uploading image and this will be conveyed in the $response_array['status'] = 'ok'
            $ImageUploadError = "";
            $adminCtrl = new AdministratorController;
            $new_adminID = $adminCtrl->create_update_Admin($params, $function, $applicationError, $ImageUploadError);

            if ($applicationError != "") {
                $response_array['status'] = 'error';  
                $response_array['action'] = $function . ' administrator';
                $response_array['message'] =  $applicationError; 
                return $response_array;
            }
            
            $response_array['status'] = 'ok'; 
            $response_array['action'] = $function . ' administrator';
            $response_array['message'] = ' administrator ' . ($function == "Create" ? 'added' : 'updated') . ' successfully';  
            $response_array['new_adminID'] = $new_adminID;
            if ($ImageUploadError != "") { //errors in administrator image upload
                $response_array['message'] .= "\n however; following errors in administrator image upload: " . $ImageUploadError ;  
            }
            return $response_array;
        }
    }
?>