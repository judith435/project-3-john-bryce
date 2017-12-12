"use strict";
var login = (function() {
    
    function initValidations() {
        validationsLogin.initValidator();
        var validationMessages = validationsLogin.formValidated.validator.settings.messages;
        validationMessages.userEmail = "User name required";
        validationMessages.userPassword = "User password required";
    }        

    function setNavigationBarLoggedIn(admin) {
        $("#admr-summary").html(admin.adminName + ", " +  admin.roleName);
        $("#login").hide();
        $("#logout-link").removeClass("hide");
        $("#school-link").removeClass("hide");
        if (admin.roleName !== "sales") { //role sales in not permitted to access Administration menu
            $("#administration-link").removeClass("hide");
            $("#administration-link" ).off().click(function(event) {
                event.preventDefault();
                administration.loadAdminAside();
            });
        }    
        $("#admr-image").removeClass("hide");
        var dtForceReload = new Date();//way to force browser to reload picture after update of picture
        $("#admr-image").attr("src", app.adminImagePath + admin.adminID + ".jpg?" + dtForceReload.getTime());
        $( "#school-link" ).off().click(function(event) {
            event.preventDefault();
            school.loadSchoolAside();
        });
        $(".logout-link").off().click(function(event) {
            event.preventDefault();
            logout.logout();
        });
    }

    function afterLogin(serverData) {
        if (serverData.loginStatus === "error") { 
            alert("error in login - please contact support center ");
            return;
        }
        if (serverData.loginStatus === "no administrator with this email and password found") {
            alert(serverData.loginStatus);
        }
        else { 
            var ao = administratorObject();
            var admin  = new ao.Administrator(
                                                serverData["adminDetails"].adminID, 
                                                serverData["adminDetails"].adminName,
                                                serverData["adminDetails"].roleID, 
                                                serverData["adminDetails"].roleName, 
                                                serverData["adminDetails"].adminPhone,
                                                serverData["adminDetails"].adminEmail);
            sessionStorage.setItem("administrator", JSON.stringify(admin));   
            setNavigationBarLoggedIn(admin); 
        }
    }

    function setUpLogin(){ //user not logged in - remove login data from naviagation bar and display login panel
        
        $.ajax("templates/login.html").done(function(data) {
            $("#login").empty();
            $("#login").prepend(data);
            
            logout.setNavigationBarLoggedOut();
            initValidations();

            $("#btnLogin").off().click(function() {
                if (validationsLogin.formValidated.contents.valid()){
                    var formContents = $("form").serialize();
                    serverRequest.sendServerRequest("Select", formContents, afterLogin); 
                    return false;
                }
            });
        });
    }
        

    return {
        setUpLogin,
        setNavigationBarLoggedIn
    };

}());

