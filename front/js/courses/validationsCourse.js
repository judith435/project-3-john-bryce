"use strict"; 

var validationsCourse = (function() {

    var formValidated = {};

    function initValidator() {
        formValidated.contents = $("#frmCUD");
        formValidated.validator = formValidated.contents.validate({
            onkeyup: false,
            onfocusout: false,
                    rules:  {
                course_name: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                }, 
                course_description: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                },
                course_image: {
                    extension: "jpg|jpeg|png|gif"
                }, 
                duplicate_course: {  
                    courseAlreadyExists: true
                } 
            }
        });

        var response;
        $.validator.addMethod(
            "courseAlreadyExists", 
            function() {
                
                var courseName = $("#courseName").val().trim();
                
                if (courseName == "") {
                    return true; //if courseName name  missing no point in checking
                }

                //update course: no change made to data retrieved from db return relevant message to user
                if (courseSave.courseAction.chosen === "Update") {
                    // if (app.debugMode){
                    //     console.log("courseAlreadyExists() courseName from update: " + courses.courseHandled.details.course_name);
                    // }
                    var courseDescription = $("#courseDescription").val().trim();
                    var courseImage = $("#courseImage").val().trim(); 
                    var courseImgDeleteChecked = ($("#deleteImage").is(":checked"));

                    if (courseName === courses.courseHandled.details.course_name &&
                        courseDescription === courses.courseHandled.details.course_description &&
                        courseImage === "" && !courseImgDeleteChecked) { 
                            formValidated.validator.settings.messages.duplicate_course = "No change in data - No update";
                            return false; 
                    }
                    else {
                        formValidated.validator.settings.messages.duplicate_course = "Course with same name found";
                    }

                    //check course name has been changed - if NOT prevent running duplicate_course test ==> it always going to exist
                    if (courseName === courses.courseHandled.details.course_name) {
                        return true; 
                    }  
                }

              var ajaxData = {
                  ctrl: "course",
                  course_name: courseName
              }; 
      
            //   if (app.debugMode){
            //       console.log("validations >>>  ajaxData.course_name  " + ajaxData.courseName);
            //   }  
              
              $.ajax({
                        type: "GET",
                        url: app.schoolApi,
                        async: false,
                        data: ajaxData
                    })
                    .done(function(data)
                      {
                        var course = JSON.parse(data);
                        //-1 means course with same course name was not found
                        response = ( course.id == -1 ) ?  true : false;
                        // if(app.debugMode){
                        //   console.log("check course name does not already exist" + data);
                        // }
                      })
                    .fail(function(data){
                    //   console.log(".fail >>>  data  " + data);
                      response = true;
                    });
                    return response;
              });
      

    }

    return {
        initValidator: initValidator,
        formValidated: formValidated
    };

}());
