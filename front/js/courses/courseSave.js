"use strict";

var courseSave = (function() {

    var courseAction = {}; //data used by validationsCourse.js ->  need to know if update or insert

    function initValidations() {
        validationsCourse.initValidator();
        var validationMessages = validationsCourse.formValidated.validator.settings.messages;
        validationMessages.courseName = "Course name required";
        validationMessages.courseDescription = "Course description required";
        validationMessages.courseImage = "Valid extensions: jpg, jpeg, png or gif";
        validationMessages.duplicateCourse = "Course with same name found";
    }        

    function displayAfterSave(serverResponse, action){
        let courseTemp = action === "Create" ? serverResponse.new_courseID  : courses.courseHandled.details.courseID; 
        let courseToDisplay = $.grep(courses.courseArray, function(e){ return e.courseID === courseTemp;});
        let co = courseObject();
        //update courseHandled with updated course data
        courses.courseHandled.details = new co.Course(  courseToDisplay[0].courseID, 
                                                courseToDisplay[0].courseName, 
                                                courseToDisplay[0].courseDescription, 
                                                courseToDisplay[0].numberOfStudentsForCourse, 
                                                courseToDisplay[0].studentIDs);
        courses.loadCourseView();
    }

    function deleteCourse(ajaxData) {
        var confirmation = confirm("Are you sure you want to delete course number " + courses.courseHandled.details.courseID + "?");
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
                btnSaveHandler,
                courseAction, //data: data used by validationsCourse.js ->  need to know if update or insert
                initValidations,
                displayAfterSave
           };
        
}());
        