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
                array_push($allCourses, new CourseModel(["courseID" => $row['courseID'], 
                                                         "courseName" => $row['courseName'],
                                                         "courseDescription" => $row['courseDescription'],
                                                         "numberOfStudentsForCourse" => $row['numberOfStudentsForCourse'],
                                                         "studentIDs" => $row['studentIDs']],
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
            //insert => if course found  $applicationError will contain corresponding message and CourseApi.php will send apropriate message back to client 
            $courseID =  $course_bll->insert_update_course($course, $method, $applicationError);
            $new_courseID = 0;
            if ($method == "Create"){
                $new_courseID =  $courseID['new_course_id'];         
            }

            //save course image
            $imgHandling = new ImageHandling();
            //test if update with option to delete image (checkbox deleteImage) Delete Image on Server
            if (array_key_exists("delete_image", $params)) {
                $imgHandling->delete_image($course->getCourseID(), "course");
                return $new_courseID;
            }
            //if new course send new course id returned from mysql if update send courseID of updated course to handle_course_image function any errors 
            //in image selected by user or error in attempts to save image will be written to $ImageUploadError so they can be sent back to user
            $imgHandling->save_uploaded_image(
                $method == "Create" ? $new_courseID :  $course->getCourseID(), 
                "course", $ImageUploadError);
            return $new_courseID; 
        }

        function delete_Course($params) {
            $course_bll = new Course_BLL();
            $course_bll->delete_course($params);
            //delete course image stored in images folder
            $imgHandling = new ImageHandling();
            $imgHandling->delete_image($params["courseID"], "course");
        }

        //used for js remote validation validationsCourse.js  method: courseAlreadyExists
        function getCourseByName($params) {  
            $course_bll = new Course_BLL();
            $course_id = $course_bll->check_course_exists($params);
            if ($course_id == false){ //no course found with given course name
                $course_id = ["id" => -1];
            }
            return $course_id;
        }
    }
?>