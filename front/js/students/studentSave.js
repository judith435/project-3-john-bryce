"use strict";

var studentSave = (function() {

    var studentAction = {}; //create object (in return statement) that can be referenced by validationsStudent.js - validations need to know whether update or insert
    
    function initValidations() {
        validationsStudent.initValidator();
        var validationMessages = validationsStudent.formValidated.validator.settings.messages;
        validationMessages.student_name = "Student name required";
        validationMessages.student_phone = "Valid phone required";
        validationMessages.student_email = "Valid email required";
        validationMessages.student_image = "Valid extensions: jpg, jpeg, png or gif";
        validationMessages.duplicate_student = "Student with same name, phone & email found";
    }        
    
    function displayAfterSave(serverResponse, action){
        let studentTemp = action === "Create" ? serverResponse.new_studentID  : students.studentHandled.details.student_id; 
        let studentToDisplay = $.grep(students.studentArray, function(e)
                                             { return e.student_id ==  studentTemp; });
        var so = studentObject();
        students.studentHandled.details = new so.Student(studentToDisplay[0].student_id, 
                                                        studentToDisplay[0].student_name, 
                                                        studentToDisplay[0].student_phone, 
                                                        studentToDisplay[0].student_email, 
                                                        studentToDisplay[0].student_courses);
        students.loadStudentView();
    }
    
    function deleteStudent(ajaxData) {
        var confirmation = confirm("Are you sure you want to delete student number " + students.studentHandled.details.student_id + "?");
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

            if (this.id === "btnDelete") { 
                deleteStudent(ajaxData);
                return false;
            }

            studentAction.chosen = action;
            verb =  action === "Add" ? "Add" : "Update"; 
            if (validationsStudent.formValidated.contents.valid()){
                serverRequest.sendServerRequest
                    (verb, ajaxData, common.afterCourseStudentSave, "studentImage", "student_image");  
                return false;
            }
        });
    }  
        
    return {
                initValidations: initValidations, //used by students.js
                btnSaveHandler: btnSaveHandler, //used by students.js
                studentAction: studentAction, //data: data used by validationsStudent.js ->  need to know if update or insert
                displayAfterSave: displayAfterSave //used by common.js
            };
        
}());
        
        