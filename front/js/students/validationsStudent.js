"use strict";

var validationsStudent = (function() {

    var formValidated = {};

    function initValidator() {
        formValidated.contents = $("#frmCUD");
        formValidated.validator = formValidated.contents.validate({
            onkeyup: false,
            onfocusout: false,
            rules:  {
                student_name: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                }, 
                student_phone: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                },
                student_email: {
                    required: true,
                    email: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                },
                studentImage: {
                    extension: "jpg|jpeg|png|gif"
                  }, 
                duplicate_student: {  
                    studentAlreadyExists: true
                } 
            }
        });

        //duplicate_student handling
        var studentKeyNotExists = true;
        
        function checkStudentUpdate(studentName, studentPhone, studentEmail) {

            var studentImage = $("#studentImage").val().trim(); 
            var studentImgDeleteChecked = ($("#deleteImage").is(":checked"));

            //build array of all courses selected in checkbox list which is then converted to string to compare it to courses selected in studentHandled before update 
            var selectedInPanel   = [];
            $("#cblistCourses input:checked").each(function() {
                selectedInPanel.push($(this).attr("name"));
            });

            if (studentName === students.studentHandled.details.student_name &&
                studentPhone === students.studentHandled.details.student_phone &&
                studentEmail === students.studentHandled.details.student_email &&
                selectedInPanel + "" === students.studentHandled.details.student_courses &&
                studentImage === "" && !studentImgDeleteChecked) { 
                     formValidated.validator.settings.messages.duplicate_student = "No change in data - No update";
                     studentKeyNotExists = false;
                     return "end validations";// error found: "No change in data - No update"; 
            }

            formValidated.validator.settings.messages.duplicate_student = "Student with same name, phone & email found";
            //check student name, phone & email has been changed - if NOT prevent running duplicate student test ==> it always going to exist

            if (studentName === students.studentHandled.details.student_name &&
                studentPhone === students.studentHandled.details.student_phone &&
                studentEmail === students.studentHandled.details.student_email) {
                    studentKeyNotExists = true;
                    return "end validations"; //no error "no change in student key" end validations with true; 
                } 
                
            return "continue validations";//need to continue validations with "check duplicate student";
        }

        function checkDuplicateStudentOnServer(studentName, studentPhone, studentEmail) {
            var ajaxData = {
                ctrl: "student",
                student_name: studentName,
                student_phone: studentPhone,
                student_email: studentEmail
            }; 
    
            // if (app.debugMode){
            //     console.log("validations >>>  " + ajaxData.student_name + "  " + ajaxData.student_phone  + "    " + ajaxData.student_email );
            // }  

            $.ajax({
                        type: "GET",
                        url: app.schoolApi,
                        async: false,
                        data: ajaxData
                    })
                    .done(function(data)
                    {
                        var serverResponse = JSON.parse(data);
                        //user no longer logged in on server (session no longer exists - make user login again) DON'T call callback method
                        if (serverResponse.status === "no longer logged in") { 
                            login.setUpLogin(); //no = user not logged in
                            return;
                        }
                        //-1 means student with same student name, phone $ email was not found
                        studentKeyNotExists = ( serverResponse.status === -1 ) ?  true : false;
                        // if(app.debugMode){
                        //     console.log("check student name does not already exist" + data);
                        // }
                    })
                    .fail(function(data){
                        // console.log(".fail >>>  data  " + data);
                        studentKeyNotExists = false;
                    });
        }

        $.validator.addMethod(
            "studentAlreadyExists", 
            function() {

                var studentName = $("#studentName").val().trim();
                var studentPhone = $("#studentPhone").val().trim();
                var studentEmail = $("#studentEmail").val().trim();
  
                if (studentName === "" || studentPhone === "" || studentEmail === "" ) {
                    return true; //if student name phone and email missing no point in checking
                }
              
                //update student: no change made to data retrieved from db return relevant message to user
                if (studentSave.studentAction.chosen === "Update") {
                    // if (app.debugMode){
                    //     console.log("studentAlreadyExists(): " + students.studentHandled.details.student_name + "  " + students.studentHandled.details.student_phone + "  " + students.studentHandled.details.student_email + "  ");
                    // }
                    var result = checkStudentUpdate(studentName, studentPhone, studentEmail);
                    if (result === "end validations"){
                        return studentKeyNotExists;
                    }
                }
                checkDuplicateStudentOnServer(studentName, studentPhone, studentEmail);  
                return studentKeyNotExists;
            });
      

    }

    return {
        initValidator: initValidator,
        formValidated: formValidated
    };

}());
