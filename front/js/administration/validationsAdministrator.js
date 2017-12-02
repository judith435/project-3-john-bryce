"use strict"; 

var validationsAdministrator = (function() {

    var formValidated = {};
    
    function initValidator() {
        formValidated.contents = $("#frmCUD");
        formValidated.validator = formValidated.contents.validate({
            onkeyup: false,
            onfocusout: false,
            rules:  {
                admin_name: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                }, 
                admin_phone: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                },
                admin_email: {
                    required: true,
                    email: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                },
                admin_password: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                },
                role_id: {
                    required: true
                },
                admin_image: {
                    extension: "jpg|jpeg|png|gif"
                }, 
                duplicate_admin: {  
                    adminAlreadyExists: true
                } 
            }
        });

        function checkAdminUpdate(adminName, adminEmail) {

            var adminPhone = $("#adminPhone").val().trim();
            var adminRole = $("#RoleDDL option").eq($("#RoleDDL").prop("selectedIndex")).val(); 
            var adminImage = $("#adminImage").val().trim(); 
            var adminImgDeleteChecked = ($("#deleteImage").is(":checked"));

            if (adminName === administration.adminHandled.details.admin_name &&
                adminEmail === administration.adminHandled.details.admin_email &&
                adminPhone === administration.adminHandled.details.admin_phone &&
                adminRole == administration.adminHandled.details.role_id &&
                adminImage === "" && !adminImgDeleteChecked) { 
                     formValidated.validator.settings.messages.duplicate_admin = "No change in data - No update";
                     return "No change in data - No update"; 
            }
            formValidated.validator.settings.messages.duplicate_admin = "Administrator with same name and email found";
            //check administrator name & email changed - if NOT don't run duplicate admin test ==> it always going to exist (refering to itself)
            if (adminName === administration.adminHandled.details.admin_name && 
                adminEmail === administration.adminHandled.details.admin_email) {
                return "no change in admin key"; 
            }  
            return "check duplicate admin";
        }

        function checkDuplicateAdminOnServer(adminName, adminEmail) {
            var ajaxData = {
                ctrl: "administrator",
                admin_name: adminName,
                admin_email: adminEmail
              }; 
    
            // if (app.debugMode){
            //     console.log("validations >>>  ajaxData.administrator_name  " + ajaxData.admin_name);
            //     console.log("validations >>>  ajaxData.administrator_phone  " + ajaxData.admin_email);
            //   }  
            $.ajax({
                      type: "GET",
                      url: app.schoolApi,
                      async: false,
                      data: ajaxData
                })
                .done(function(data)
                {
                    var admin = JSON.parse(data);
                    if ($.inArray(status, admin)) {//call to server revealed admin sales accessing admin menu
                        if (admin.status === "error") {
                            alert("Following error(s) occured in " + admin.action + ":\n" + admin.message);
                            return true;
                        }
                    }
                    //-1 means student with same student name was not found
                    return ( admin.id == -1 ) ?  true : false;
                    
                    // if(app.debugMode){
                    //     console.log("check admin name & phone does not already exist" + data);
                    // }
                })
                .fail(function(data){
                    // console.log(".fail >>>  data  " + data);
                    return true;
                });
        }  

        $.validator.addMethod(
            "adminAlreadyExists", 
            function() {

                var adminName = $("#adminName").val().trim();
                var adminEmail = $("#adminEmail").val().trim();

                if (adminName === "" && adminEmail === "") {
                    return true; //if courseName name  missing no point in checking
                }

                //update administrator : no change made to data retrieved from db return relevant message to user
                if (administration.action.chosen === "Update") {
                    // if (app.debugMode){
                    //     console.log("adminAlreadyExists() adminName from update: " + administration.adminHandled.admin_name);
                    // }
                    var result = checkAdminUpdate(adminName, adminEmail);
                    switch (result) {
                        case "No change in data - No update":
                            return false;
                            break;
                        case "no change in admin key":
                            return true;
                            break;
                        case "check duplicate admin":
                            ;  //empty statement
                    }
                    return checkDuplicateAdminOnServer(adminName, adminEmail);  
                }
            });
    }

    return {
        initValidator: initValidator,
        formValidated: formValidated
    };

}());

