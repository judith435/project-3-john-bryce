"use strict"; 

var validationsAdministrator = (function() {

    var formValidated = {};
    
    function initValidator() {
        formValidated.contents = $("#frmCUD");
        formValidated.validator = formValidated.contents.validate({
            onkeyup: false,
            onfocusout: false,
            rules:  {
                adminName: {
                    required: true,
                    normalizer(value) {
                        return $.trim(value);
                    } 
                }, 
                adminPhone: {
                    required: true,
                    normalizer(value) {
                        return $.trim(value);
                    } 
                },
                adminEmail: {
                    required: true,
                    email: true,
                    normalizer(value) {
                        return $.trim(value);
                    } 
                },
                adminPassword: {
                    required: true,
                    normalizer(value) {
                        return $.trim(value);
                    } 
                },
                roleID: {
                    required: true
                },
                adminImage: {
                    extension: "jpg|jpeg|png|gif"
                }, 
                adminImageSize: {
                    checkImageSize: true
                }, 
                duplicateAdmin: {  
                    adminAlreadyExists: true
                } 
            }
        });

        //duplicateAdmin handling
        var adminKeyNotExists = true;

        function checkAdminUpdate(adminName, adminEmail) {

            var adminPhone = $("#adminPhone").val().trim();
            var adminRole = parseInt($("#RoleDDL option").eq($("#RoleDDL").prop("selectedIndex")).val()); 
            var adminImage = $("#adminImage").val().trim(); 
            var adminImgDeleteChecked = ($("#deleteImage").is(":checked"));

            if (adminName === administration.adminHandled.details.adminName &&
                adminEmail === administration.adminHandled.details.adminEmail &&
                adminPhone === administration.adminHandled.details.adminPhone &&
                adminRole === administration.adminHandled.details.roleID &&
                adminImage === "" && !adminImgDeleteChecked) { 
                     formValidated.validator.settings.messages.duplicateAdmin = "No change in data - No update";
                     adminKeyNotExists = false;
                     return "end validations";// error found: "No change in data - No update"; 
            }
            formValidated.validator.settings.messages.duplicateAdmin = "Administrator with same name and email found";
            //check administrator name & email changed - if NOT don't run duplicate admin test ==> it always going to exist (refering to itself)
            if (adminName === administration.adminHandled.details.adminName && 
                adminEmail === administration.adminHandled.details.adminEmail) {
                adminKeyNotExists = true;
                return "end validations"; //no error "no change in admin key" end validations with true; 
            }  
            return "continue validations";//need to continue validations with "check duplicate admin";
        }

        function checkDuplicateAdminOnServer(adminName, adminEmail) {
            var ajaxData = {
                ctrl: "administrator",
                adminName,
                adminEmail
              }; 
    
            // if (app.debugMode){
            //     console.log("validations >>>  ajaxData.administrator_name  " + ajaxData.adminName);
            //     console.log("validations >>>  ajaxData.administrator_phone  " + ajaxData.adminEmail);
            //   }  
            $.ajax({
                      type: "GET",
                      url: app.schoolApi,
                      async: false,
                      data: ajaxData
                })
                .done(function(data)
                {
                    var serverResponse = JSON.parse(data);
                    if (serverResponse.status === "no longer logged in") { 
                        login.setUpLogin(); //no = user not logged in
                        return;
                    }
                    //-1 means admin with same admin name & email was not found
                    adminKeyNotExists = (serverResponse.adminID === -1) ?  true : false;
                    // if(app.debugMode){
                    //     console.log("check admin name & phone does not already exist" + data);
                    // }
                })
                .fail(function(data){
                    // console.log(".fail >>>  data  " + data);
                    adminKeyNotExists = true; //error occured - cancel validation
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
                    //     console.log("adminAlreadyExists() adminName from update: " + administration.adminHandled.adminName);
                    // }
                    var result = checkAdminUpdate(adminName, adminEmail);
                    if (result === "end validations"){
                        return adminKeyNotExists;
                    }
                }
                checkDuplicateAdminOnServer(adminName, adminEmail);  
                return adminKeyNotExists;
            });

            $.validator.addMethod(
                "checkImageSize", 
                function() {
                    let image = $("#adminImage").prop("files")[0]; 
                    if (image !== undefined && image !== null) {
                        if (image.size > 5000000) {
                           formValidated.validator.settings.messages.adminImageSize = "Image larger than 5MB - actual size: " + image.size + " bytes";
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

