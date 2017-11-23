<?php 

    require_once '../models/CourseModel.php';
    require_once '../bl/Course_BLL.php';
    require_once '../share/ImageHandling.php';
    
    class CourseController {


        function getAll_Courses() {
            $course_bll = new Course_BLL();
            $resultSet = $course_bll->get_courses();

            $allCourses = array();
            //$errorInInput will contain any problems found in data retrieved from db () creating CourseModel
            //object automatically validates the data - at this stage no further processing occurs with any faulty
            //db data
            $errorInInput = ""; 
            
            while ($row = $resultSet->fetch())
            {                           
                array_push($allCourses, new CourseModel(["course_id" => $row['course_id'], 
                                                         "course_name" => $row['course_name'],
                                                         "course_description" => $row['course_description'],
                                                         "number_of_students_for_course" => $row['number_of_students_for_course'],
                                                         "student_ids" => $row['student_ids']],
                                                         $errorInInput));
            }
            return $allCourses;
        }

        function create_update_Course($params, $method, &$applicationError, &$ImageUploadError) {
            $course = new CourseModel($params, $applicationError);
            if ($applicationError != "") { //error found in data members of course object - faulty user input
                return;
            }
            $course_bll = new Course_BLL();
            //insert => if course already exists  $applicationError will contain corresponding message and CourseApi.php will send apropriate message back to client 
            $courseID =  $course_bll->insert_update_course($course, $method, $applicationError);
            if ($method == "Create"){
                $new_courseID =  $courseID['new_course_id'];         
            }
            else {
                $new_courseID = 0;
            }

            //save course image
            $ih = new ImageHandling();
            //test if update with option to delete image (checkbox deleteImage) Delete Image on Server
            if ($method == "Update" && array_key_exists("delete_image", $params)) {
                $ih->delete_image($params["course_id"], "course");
            }
            else {
                //if new course send new course id returned from mysql if update send course_id of updated course to handle_course_image function any errors 
                //in image selected by user or error in attempts to save image will be written to $ImageUploadError so they can be sent back to user
                $ih->save_uploaded_image($method, $method == "Create" ? $new_courseID :  $params["course_id"], "course", $ImageUploadError);
            }
            return $new_courseID;
        }

        function delete_Course($params) {
            $course_bll = new Course_BLL();
            $course_bll->delete_course($params);
            //delete course image stored in images folder
            $ih = new ImageHandling();
            $ih->delete_image($params["course_id"], "course");
        }
        
        function getCourseByName($params) { //used for js remote validation
            $course_bll = new Course_BLL();
            $course_id = $course_bll->check_course_exists($params);
            if ($course_id == false){ //no course found with given course name
                $course_id = ["id" => -1];
            }
            return $course_id;
        }
    }
?>