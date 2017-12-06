"use strict";

var validationsStudent = (function() {

    var formValidated = {};

    function initValidator() {
        formValidated.contents = $("#frmCUD");
        formValidated.validator = formValidated.contents.validate({
            onkeyup: false,
            onfocusout: false,
            rules:  {
                studentName: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                }, 
                studentPhone: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                },
                studentEmail: {
                    required: true,
                    email: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                },
                studentImage: {
                    extension: "jpg|jpeg|png|gif"
                }, 
                studentImageSize: {
                    checkImageSize: true
                }, 
                duplicateStudent: {  
                    studentAlreadyExists: true
                } 
            }
        });

        //duplicateStudent handling
        var studentKeyNotExists = true;
        
        function checkStudentUpdate(studentName, studentPhone, studentEmail) {

            var studentImage = $("#studentImage").val().trim(); 
            var studentImgDeleteChecked = ($("#deleteImage").is(":checked"));

            //build array of all courses selected in checkbox list which is then converted to string to compare it to courses selected in studentHandled before update 
            var selectedInPanel   = [];
            $("#cblistCourses input:checked").each(function() {
                selectedInPanel.push($(this).attr("name"));
            });

            if (studentName === students.studentHandled.details.studentName &&
                studentPhone === students.studentHandled.details.studentPhone &&
                studentEmail === students.studentHandled.details.studentEmail &&
                selectedInPanel + "" === students.studentHandled.details.studentCourses &&
                studentImage === "" && !studentImgDeleteChecked) { 
                     formValidated.validator.settings.messages.duplicateStudent = "No change in data - No update";
                     studentKeyNotExists = false;
                     return "end validations";// error found: "No change in data - No update"; 
            }

            formValidated.validator.settings.messages.duplicateStudent = "Student with same name, phone & email found";
            //check student name, phone & email has been changed - if NOT prevent running duplicate student test ==> it always going to exist

            if (studentName === students.studentHandled.details.studentName &&
                studentPhone === students.studentHandled.details.studentPhone &&
                studentEmail === students.studentHandled.details.studentEmail) {
                    studentKeyNotExists = true;
                    return "end validations"; //no error "no change in student key" end validations with true; 
                } 
                
            return "continue validations";//need to continue validations with "check duplicate student";
        }

        function checkDuplicateStudentOnServer(studentName, studentPhone, studentEmail) {
            var ajaxData = {
                ctrl: "student",
                studentName: studentName,
                studentPhone: studentPhone,
                studentEmail: studentEmail
            }; 
    
            // if (app.debugMode){
            //     console.log("validations >>>  " + ajaxData.studentName + "  " + ajaxData.studentPhone  + "    " + ajaxData.studentEmail );
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
  
                // if (studentName === "" || studentPhone === "" || studentEmail === "" ) {
                //     return true; //if student name phone and email missing no point in checking
                // }
              
                //update student: no change made to data retrieved from db return relevant message to user
                if (studentSave.studentAction.chosen === "Update") {
                    // if (app.debugMode){
                    //     console.log("studentAlreadyExists(): " + students.studentHandled.details.studentName + "  " + students.studentHandled.details.studentPhone + "  " + students.studentHandled.details.studentEmail + "  ");
                    // }
                    var result = checkStudentUpdate(studentName, studentPhone, studentEmail);
                    if (result === "end validations"){
                        return studentKeyNotExists;
                    }
                }
                checkDuplicateStudentOnServer(studentName, studentPhone, studentEmail);  
                return studentKeyNotExists;
            });
      
            $.validator.addMethod(
                "checkImageSize", 
                function() {
                    let image = $("#studentImage").prop("files")[0]; 
                    if (image !== undefined) {
                        if (image.size > 5000000) {
                           formValidated.validator.settings.messages.studentImageSize = "Image larger than 5MB - actual size: " + image.size + " bytes";
                           return false;
                        }
                    }
                    return true;
            });
    }

    return {
        initValidator,
        formValidated
    };

}());
