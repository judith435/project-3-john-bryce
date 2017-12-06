"use strict"; 

var validationsCourse = (function() {

    var formValidated = {};

    function initValidator() {
        formValidated.contents = $("#frmCUD");
        formValidated.validator = formValidated.contents.validate({
            onkeyup: false,
            onfocusout: false,
                    rules:  {
                courseName: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                }, 
                courseDescription: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                },
                courseImage: {
                    extension: "jpg|jpeg|png|gif"
                }, 
                courseImageSize: {
                    checkImageSize: true
                }, 
                duplicateCourse: {  
                    courseAlreadyExists: true
                } 
            }
        });

        //duplicateCourse handling
        var courseKeyNotExists = true;

        function checkCourseUpdate(courseName) {
            var courseDescription = $("#courseDescription").val().trim();
            var courseImage = $("#courseImage").val().trim(); 
            var courseImgDeleteChecked = ($("#deleteImage").is(":checked"));

            if (courseName === courses.courseHandled.details.courseName &&
                courseDescription === courses.courseHandled.details.courseDescription &&
                courseImage === "" && !courseImgDeleteChecked) { 
                    formValidated.validator.settings.messages.duplicateCourse = "No change in data - No update";
                    courseKeyNotExists = false;
                    return "end validations";// error found: "No change in data - No update"; 
            }
            formValidated.validator.settings.messages.duplicateCourse = "Course with same name found";

            //check course name has been changed - if NOT prevent running duplicateCourse test ==> it always going to exist
            if (courseName === courses.courseHandled.details.courseName) {
                courseKeyNotExists = true;
                return "end validations"; //no error "no change in admin key" end validations with true; 
            }  
            return "continue validations";//need to continue validations with "check duplicate course";
        }
        
        function checkDuplicateCourseOnServer(courseName) {
            var ajaxData = {
                ctrl: "course",
                courseName: courseName
            }; 
    
          //   if (app.debugMode){
          //       console.log("validations >>>  ajaxData.courseName  " + ajaxData.courseName);
          //   }  
            
            $.ajax  ({
                      type: "GET",
                      url: app.schoolApi,
                      async: false,
                      data: ajaxData
                    })
                    .done(function(data)
                    {
                      var course = JSON.parse(data);
                      //-1 means course with same course name was not found
                      courseKeyNotExists = ( course.id === -1 ) ?  true : false;
                      // if(app.debugMode){
                      //   console.log("check course name does not already exist" + data);
                      // }
                    })
                    .fail(function(data){
                    //   console.log(".fail >>>  data  " + data);
                        courseKeyNotExists = true;
                    });
        }

        $.validator.addMethod(
            "courseAlreadyExists", 
            function() {
                
                var courseName = $("#courseName").val().trim();
                
                if (courseName === "") {
                    return true; //if courseName name  missing no point in checking
                }

                //update course: no change made to data retrieved from db return relevant message to user
                if (courseSave.courseAction.chosen === "Update") {
                    // if (app.debugMode){
                    //     console.log("courseAlreadyExists() courseName from update: " + courses.courseHandled.details.courseName);
                    // }
                    var result = checkCourseUpdate(courseName);
                    if (result === "end validations"){
                        return courseKeyNotExists;
                    }
                }

                checkDuplicateCourseOnServer(courseName);  
                return courseKeyNotExists;

              });
      
            $.validator.addMethod(
                "checkImageSize", 
                function() {
                    let image = $("#courseImage").prop("files")[0]; 
                    if (image !== undefined) {
                        if (image.size > 5000000) {
                           formValidated.validator.settings.messages.courseImageSize = "Image larger than 5MB - actual size: " + image.size + " bytes";
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
