"use strict"
//entry point for entire application - jQuery(document).ready(function()  is first thing to run

//global variables used by all js files
var app = {
    debugMode: false,   
    schoolApi:        "http://localhost/project-3-john-bryce/back/api/api.php",
    adminImagePath:   "http://localhost/project-3-john-bryce/back/images/admins/image_for_admin_id_",
    courseImagePath:  "http://localhost/project-3-john-bryce/back/images/courses/image_for_course_id_",
    studentImagePath: "http://localhost/project-3-john-bryce/back/images/students/image_for_student_id_"
}

jQuery(document).ready(function() {
    $.ajax("templates/navigation.html").done(function(data) {
        $("#navigation-bar").prepend(data);
        login_logout.login();    
    });
})