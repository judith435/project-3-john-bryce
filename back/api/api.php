<?php
    //AdministratorApi.php must be placed first so session can reference Administrator object 
    require_once 'AdministratorApi.php'; 
    session_start();
    
    require_once 'CourseApi.php';
    require_once 'LoginApi.php';
    require_once 'RoleApi.php';
    require_once 'StudentApi.php';
    require_once '../share/ErrorHandling.php';
    //unset($_SESSION['user_logged_in']); //%$#%#$$#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    
    //define error handling for site
    set_exception_handler('exception_handler');
    function exception_handler($exception) {
        ErrorHandling::HandleError($exception); 
    }

    //define root folder for php back - presently only used in connection with  image handling but could be used in other contexts later 
    define ('SITE_ROOT', realpath(dirname(__FILE__)));
    $GLOBALS['siteRoot'] = substr(SITE_ROOT, 0, strrpos(SITE_ROOT,"\\"));  //remove \\api from path

    $method = $_SERVER['REQUEST_METHOD']; // verb
    $params = []; //contains data sent to server from client in REST protocol

    if ($method == 'GET' || $method == 'POST') {
        $params = $_REQUEST;
    }
    else //verbs DELETE & PUT
    {
        parse_str(file_get_contents("php://input"), $params);    
    }

    //trim all leading and trailing blank from parameters posted to server from client
    $params = array_map("trim", $params);

    //session object with user logon info no longer exists - only action permissible in this state is login 
    //for all other actions end processing and send message back to client - can redirect user to login panel  
    if(!array_key_exists('user_logged_in',$_SESSION) || empty($_SESSION['user_logged_in'])) {
       if(($params['ctrl']) != 'login' ) {
            $response_array['status'] = 'no longer logged in';  
            $response_array['action'] = $method . ' ' . $params['ctrl'];
            echo json_encode($response_array);
            return;
       }
    }
    else { //user_logged_in session variable exists check admin type not trying to perform forbidden actions
        $admin = $_SESSION["user_logged_in"];//check admin type of user (sales) and prevent user performing actions he is not entitled to
        if ($admin->getRoleName() == "sales") { 
            if ($params['ctrl'] ==  'administrator' || //no access (CRUD) to administrator data allowed for sales  
               ($params['ctrl'] ==  'course' && $method != "GET" )) {  //no access (CUD) to update course data allowed for sales - only read (GET) allowed 
                $response_array['status'] = 'error';  
                $response_array['action'] = $method . ' ' . $params['ctrl'];
                $response_array['message'] = 'administrator sales attempted forbidden actions';
                echo json_encode($response_array);
                return;
            }
        }
    }

    //PUT cannot upload files to server => data had to be sent via post now processing must be reset to PUT 
    if (array_key_exists("verb_change", $params)) { 
        $method = "PUT";
    }

    switch ($params['ctrl']) {
        case 'login':
            $login_api = new LoginApi();
            $response = $login_api->gateway($method, $params);
            echo json_encode($response);
            break;
        case 'course':
            $course_api = new CourseApi();
            $response = $course_api->gateway($method, $params);
            echo json_encode($response);
            break;
        case 'student':
            $student_api = new StudentApi();
            $response = $student_api->gateway($method, $params);
            echo json_encode($response);
            break;
        case 'administrator':
            $admin_api = new AdministratorApi();
            $response = $admin_api->gateway($method, $params);
            echo json_encode($response);
            break;
        case 'role':
            $role_api = new RoleApi();
            $response = $role_api->gateway($method, $params);
            echo json_encode($response);
            break;
    }