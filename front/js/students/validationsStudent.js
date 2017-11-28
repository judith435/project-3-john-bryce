"use strict" 

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
                    student_already_exists: true
                } 
            }
        });

        var response;
        $.validator.addMethod(
            "student_already_exists", 
            function() {
                var studentName = $("#studentName").val().trim();
                var studentPhone = $("#studentPhone").val().trim();
                var studentEmail = $("#studentEmail").val().trim();
  
                if (studentName == "" || studentPhone == "" || studentEmail == "" ) {
                    return true; //if student name phone and email missing no point in checking
                }
              
            //update student: no change made to data retrieved from db return relevant message to user
            if (students.student_action.chosen === "Update") {
                if (app.debugMode){
                    console.log("student_already_exists(): " + students.studentHandled.details.student_name + "  " + students.studentHandled.details.student_phone + "  " + students.studentHandled.details.student_email + "  ");
                }
                var studentImage = $("#studentImage").val().trim(); 
                var student_img_delete_checked = ($("#deleteImage").is(":checked"));

                //build array of all courses selected in checkbox list which is then converted to string to compare it to courses selected in studentHandled before update 
                var selected_in_panel   = [];
                $("#cblistCourses input:checked").each(function() {
                    selected_in_panel.push($(this).attr("name"));
                });

                if (studentName === students.studentHandled.details.student_name &&
                    studentPhone === students.studentHandled.details.student_phone &&
                    studentEmail === students.studentHandled.details.student_email &&
                    selected_in_panel + "" == students.studentHandled.details.student_courses &&
                    studentImage == "" && !student_img_delete_checked) { 
                         formValidated.validator.settings.messages.duplicate_student = "No change in data - No update";
                         return false; 
                }
                else {
                    formValidated.validator.settings.messages.duplicate_student = "Student with same name, phone & email already exists";
                }

                //check student name, phone & email has been changed - if NOT prevent running duplicate student test ==> it always going to exist
                if (studentName === students.studentHandled.details.student_name &&
                    studentPhone === students.studentHandled.details.student_phone &&
                    studentEmail === students.studentHandled.details.student_email) {
                    return true; 
                }  
            }
  
                var ajaxData = {
                    ctrl: "student",
                    student_name: studentName,
                    student_phone: studentPhone,
                    student_email: studentEmail
                }; 
        
                if (app.debugMode){
                    console.log("validations >>>  " + ajaxData.student_name + "  " + ajaxData.student_phone  + "    " + ajaxData.student_email );
                }  

                $.ajax({
                            type: "GET",
                            url: app.schoolApi,
                            async: false,
                            data: ajaxData
                        })
                        .done(function(data)
                        {
                            var student = JSON.parse(data);
                            //-1 means student with same student name was not found
                            response = ( student.id == -1 ) ?  true : false;
                            if(app.debugMode){
                                console.log("check student name does not already exist" + data);
                            }
                        })
                        .fail(function(data){
                            console.log(".fail >>>  data  " + data);
                            response = false;
                        })
                        return response;
                });
      

    }

    return {
        initValidator: initValidator,
        formValidated: formValidated
    };

})();
