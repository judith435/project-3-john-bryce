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
                student_image: {
                    extension: "jpg|jpeg|png|gif"
                  }, 
                duplicate_student: {  
                    studentAlreadyExists: true
                } 
            }
        });

        var response;
        $.validator.addMethod(
            "studentAlreadyExists", 
            function() {

                var studentsModule = students; //studentsModule contains all data exposed from js file students.js
                
                var studentName = $("#studentName").val().trim();
                var studentPhone = $("#studentPhone").val().trim();
                var studentEmail = $("#studentEmail").val().trim();
  
                if (studentName == "" || studentPhone == "" || studentEmail == "" ) {
                    return true; //if student name phone and email missing no point in checking
                }
              
            //update student: no change made to data retrieved from db return relevant message to user
            if (studentSave.studentAction.chosen === "Update") {
                // if (app.debugMode){
                //     console.log("studentAlreadyExists(): " + studentsModule.studentHandled.details.student_name + "  " + studentsModule.studentHandled.details.student_phone + "  " + studentsModule.studentHandled.details.student_email + "  ");
                // }
                var studentImage = $("#studentImage").val().trim(); 
                var studentImgDeleteChecked = ($("#deleteImage").is(":checked"));

                //build array of all courses selected in checkbox list which is then converted to string to compare it to courses selected in studentHandled before update 
                var selectedInPanel   = [];
                $("#cblistCourses input:checked").each(function() {
                    selectedInPanel.push($(this).attr("name"));
                });

                if (studentName === studentsModule.studentHandled.details.student_name &&
                    studentPhone === studentsModule.studentHandled.details.student_phone &&
                    studentEmail === studentsModule.studentHandled.details.student_email &&
                    selectedInPanel + "" == studentsModule.studentHandled.details.student_courses &&
                    studentImage == "" && !studentImgDeleteChecked) { 
                         formValidated.validator.settings.messages.duplicate_student = "No change in data - No update";
                         return false; 
                }
                else {
                    formValidated.validator.settings.messages.duplicate_student = "Student with same name, phone & email found";
                }

                //check student name, phone & email has been changed - if NOT prevent running duplicate student test ==> it always going to exist
                if (studentName === studentsModule.studentHandled.details.student_name &&
                    studentPhone === studentsModule.studentHandled.details.student_phone &&
                    studentEmail === studentsModule.studentHandled.details.student_email) {
                    return true; 
                }  
            }
  
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
                            response = ( serverResponse.status == -1 ) ?  true : false;
                            // if(app.debugMode){
                            //     console.log("check student name does not already exist" + data);
                            // }
                        })
                        .fail(function(data){
                            // console.log(".fail >>>  data  " + data);
                            response = false;
                        });
                        return response;
                });
      

    }

    return {
        initValidator: initValidator,
        formValidated: formValidated
    };

}());
