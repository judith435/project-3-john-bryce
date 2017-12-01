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
        let studentTemp = action == "Create" ? serverResponse.new_studentID  : students.studentHandled.details.student_id; 
        let student_to_display = $.grep(students.studentArray, function(e){ return e.student_id ==  studentTemp});
        var so = studentObject();
        students.studentHandled.details = new so.Student(student_to_display[0].student_id, 
                                                        student_to_display[0].student_name, 
                                                        student_to_display[0].student_phone, 
                                                        student_to_display[0].student_email, 
                                                        student_to_display[0].student_courses);
        students.loadStudentView();
    }

    function afterSave(serverResponse) {
        if (serverResponse.status === "error") {
            alert("Following error(s) occured in " + serverResponse.action + ":\n" + serverResponse.message);
            return;
        }
        if (serverResponse.message.search("following errors") != -1) { //display msg about failed image upload
            alert("Following message for " + serverResponse.action + ":\n" + serverResponse.message);
        }
        var action = serverResponse.action.split(" ", 1)[0]; //first word of serverResponse.action contains action performed
        if (action == "Delete") {
            school.loadSchoolMain();
            return
        }

        courses.showCourses();
        students.showStudents();
        //displayAfterSave must only run after both course and student has been retrieved 
        var get_course_student_data;
        function testCompletion() {
            if (courses.coursesRetrieved.status && students.studentsRetrieved.status) {
                displayAfterSave(serverResponse, action);
                clearInterval(get_course_student_data);
            }
        }
        get_course_student_data = setInterval(testCompletion, 500);
    }



    function btnSaveHandler(action) {
        
        $(".btnSave").off().click(function() {
            var verb;
            var ajaxData = $("#frmCUD").serialize();

            if(this.id === "btnDelete"){ // don't perform validations in case of delete
                var confirmation = confirm("Are you sure you want to delete student number " + students.studentHandled.details.student_id + "?");
                if (confirmation == true) {
                    verb = "Delete";
                    serverRequest.sendServerRequest(verb, ajaxData, afterSave);  
                    return false;
                }
            }   
            else {
                studentAction.chosen = action;
                verb =  action === "Add" ? "Add" : "Update"; 
                if (validationsStudent.formValidated.contents.valid()){
                    serverRequest.sendServerRequest
                        (verb, ajaxData, afterSave, "studentImage", "student_image");  
                    return false;
                }
            }
        });
    }  
        
    return {
                initValidations: initValidations, //used by students.js
                btnSaveHandler: btnSaveHandler, //used by students.js
                studentAction: studentAction //data: data used by validationsStudent.js ->  need to know if update or insert
           };
        
})();
        
        