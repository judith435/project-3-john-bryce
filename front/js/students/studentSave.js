"use strict";

var studentSave = (function() {

    var studentAction = {}; //create object (in return statement) that can be referenced by validationsStudent.js - validations need to know whether update or insert
    
    function initValidations() {
        validationsStudent.initValidator();
        var validationMessages = validationsStudent.formValidated.validator.settings.messages;
        validationMessages.studentName = "Student name required";
        validationMessages.studentPhone = "Valid phone required";
        validationMessages.studentEmail = "Valid email required";
        validationMessages.studentImage = "Valid extensions: jpg, jpeg, png or gif";
        validationMessages.duplicateStudent = "Student with same name, phone & email found";
    }        
    
    function displayAfterSave(serverResponse, action){
        let studentTemp = action === "Create" ? serverResponse.new_studentID  : students.studentHandled.details.studentID; 
        let studentToDisplay = $.grep(students.studentArray, function(e)
                                             { var tot = e;
                                                 return e.studentID ===  studentTemp; });
        var so = studentObject();
        students.studentHandled.details = new so.Student(studentToDisplay[0].studentID, 
                                                        studentToDisplay[0].studentName, 
                                                        studentToDisplay[0].studentPhone, 
                                                        studentToDisplay[0].studentEmail, 
                                                        studentToDisplay[0].studentCourses);
        students.loadStudentView();
    }
    
    function deleteStudent() {
        var confirmation = confirm("Are you sure you want to delete student number " + students.studentHandled.details.studentID + "?");
        if (confirmation === true) {
            // don't perform validations in case of delete
            var ajaxData = {
                ctrl: "student",
                studentID: $("#studentID").val() 
            };
            serverRequest.sendServerRequest("Delete", ajaxData, common.afterCourseStudentSave);  
            return false;
        }
    }

    function btnSaveHandler(action) {
        
        $(".btnSave").off().click(function() {
            var verb;

            if (this.id === "btnDelete") { 
                deleteStudent();
                return false;
            }

            var ajaxData = $("#frmCUD").serialize();
            studentAction.chosen = action;
            verb =  action === "Add" ? "Add" : "Update"; 
            if (validationsStudent.formValidated.contents.valid()){
                serverRequest.sendServerRequest
                    (verb, ajaxData, common.afterCourseStudentSave, "studentImage", "studentImage");  
                return false;
            }
        });
    }  
        
    return {
                initValidations, //used by students.js
                btnSaveHandler, //used by students.js
                studentAction,//data: data used by validationsStudent.js ->  need to know if update or insert
                displayAfterSave //used by common.js
            };
        
}());
        
        