"use strict";

var courseSave = (function() {

    var courseAction = {}; //data used by validationsCourse.js ->  need to know if update or insert

    function initValidations() {
        validationsCourse.initValidator();
        var validationMessages = validationsCourse.formValidated.validator.settings.messages;
        validationMessages.course_name = "Course name required";
        validationMessages.course_description = "Course description required";
        validationMessages.courseImage = "Valid extensions: jpg, jpeg, png or gif";
        validationMessages.duplicateCourse = "Course with same name found";
    }        

    function displayAfterSave(serverResponse, action){
        let courseTemp = action === "Create" ? serverResponse.new_courseID  : courses.courseHandled.details.course_id; 
        let courseToDisplay = $.grep(courses.courseArray, function(e){ return e.course_id === courseTemp;});
        let co = courseObject();
        //update courseHandled with updated course data
        courses.courseHandled.details = new co.Course(  courseToDisplay[0].course_id, 
                                                courseToDisplay[0].course_name, 
                                                courseToDisplay[0].course_description, 
                                                courseToDisplay[0].number_of_students_for_course, 
                                                courseToDisplay[0].student_ids);
        courses.loadCourseView();
    }

    function deleteCourse(ajaxData) {
        var confirmation = confirm("Are you sure you want to delete course number " + courses.courseHandled.details.course_id + "?");
        if (confirmation === true) {
            // don't perform validations in case of delete
            serverRequest.sendServerRequest("Delete", ajaxData, common.afterCourseStudentSave);  
            return false;
        }
    }

    function btnSaveHandler(action) {
        
        $(".btnSave").off().click(function() {
            var verb;
            var ajaxData = $("#frmCUD").serialize();

            if(this.id === "btnDelete"){ 
                deleteCourse(ajaxData);
                return false;
            }

            courseAction.chosen = action;
            verb =  action === "Add" ? "Add" : "Update"; 
            if (validationsCourse.formValidated.contents.valid()){
                serverRequest.sendServerRequest(
                    verb, ajaxData, common.afterCourseStudentSave, "courseImage", "courseImage");  
                return false;
            }
        });
    }  


    return {
                btnSaveHandler : btnSaveHandler,
                courseAction: courseAction, //data: data used by validationsCourse.js ->  need to know if update or insert
                initValidations: initValidations,
                displayAfterSave: displayAfterSave //used by common.js
           };
        
}());
        