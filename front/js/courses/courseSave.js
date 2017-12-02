"use strict";

var courseSave = (function() {

    var courseAction = {}; //data used by validationsCourse.js ->  need to know if update or insert

    function initValidations() {
        validationsCourse.initValidator();
        var validationMessages = validationsCourse.formValidated.validator.settings.messages;
        validationMessages.course_name = "Course name required";
        validationMessages.course_description = "Course description required";
        validationMessages.course_image = "Valid extensions: jpg, jpeg, png or gif";
        validationMessages.duplicate_course = "Course with same name found";
    }        

    function displayAfterSave(serverResponse, action){
        let courseTemp = action === "Create" ? serverResponse.new_courseID  : courses.courseHandled.details.course_id; 
        let courseToDisplay = $.grep(courses.courseArray, function(e){ return e.course_id ==  courseTemp;});
        let co = courseObject();
        //update courseHandled with updated course data
        courses.courseHandled.details = new co.Course(  courseToDisplay[0].course_id, 
                                                courseToDisplay[0].course_name, 
                                                courseToDisplay[0].course_description, 
                                                courseToDisplay[0].number_of_students_for_course, 
                                                courseToDisplay[0].student_ids);
        courses.loadCourseView();
    }

    // function afterSave(serverResponse) {
    //     if (serverResponse.status === "error") {
    //         alert("Following error(s) occured in " + serverResponse.action + ":\n" + serverResponse.message);
    //         return;
    //     }
    //     if (serverResponse.message.search("following errors") !== -1) { //display msg about failed image upload
    //         alert("Following message for " + serverResponse.action + ":\n" + serverResponse.message);
    //     }
    //     var action = serverResponse.action.split(" ", 1)[0]; //first word of serverResponse.action contains action performed
    //     if (action === "Delete") {
    //         school.loadSchoolMain();
    //         return;
    //     }

    //     //after each update must update both course and student date (student data also uses course data)
    //     courses.showCourses();
    //     students.showStudents();
    //     //displayAfterSave must only run after both course and student has been retrieved 
    //     var getCourseStudentData;
    //     function testCompletion() {
    //         if (courses.coursesRetrieved.status && students.studentsRetrieved.status) {
    //             displayAfterSave(serverResponse, action);
    //             clearInterval(getCourseStudentData);
    //         }
    //     }
    //     getCourseStudentData = setInterval(testCompletion, 500);
    // }

    function btnSaveHandler(action) {
        
        $(".btnSave").off().click(function() {
            var verb;
            var ajaxData = $("#frmCUD").serialize();

            if(this.id === "btnDelete"){ // don't perform validations in case of delete
                var confirmation = confirm("Are you sure you want to delete course number " + courses.courseHandled.details.course_id + "?");
                if (confirmation === true) {
                    verb = "Delete";
                    serverRequest.sendServerRequest(verb, ajaxData, common.afterCourseStudentSave);  
                    return false;
                }
            }   
            else {
                courseAction.chosen = action;
                verb =  action === "Add" ? "Add" : "Update"; 
                if (validationsCourse.formValidated.contents.valid()){
                    serverRequest.sendServerRequest(
                        verb, ajaxData, common.afterCourseStudentSave, "courseImage", "course_image");  
                    return false;
                }
            }
        });
    }  


    return {
                btnSaveHandler : btnSaveHandler,
                courseAction: courseAction, //data: data used by validationsCourse.js ->  need to know if update or insert
                initValidations: initValidations
           };
        
}());
        