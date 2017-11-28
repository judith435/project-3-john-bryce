"use strict"
var login_logout = (function() {

    function initValidations() {
        validationsLogin.initValidator();
        var validation_messages = validationsLogin.formValidated.validator.settings.messages;
        validation_messages.user_email = "User name required";
        validation_messages.user_password = "User password required";
    }        

    function setNavigationBar_LoggedOut() {
        $("#login").show();
        $("#admr-summary").text("");
        $("#admr-image").addClass("hide");
        $("#logout-link").addClass("hide");
        $("#administration-link").addClass("hide");
        $("#school-link").addClass("hide");
        $("#main-container").empty();
        $("#side-container").empty();
        $("#side-container").removeClass("bordered-right");
    }

    function afterLogout(serverData) {
        if (serverData.status === "error") { 
            alert("error in logout - please contact support center ");
        }
    }   

    function Logout(){
        handle_login_status("no"); //set page / navigation bar to logged out state
        var ajaxData = { ctrl: "login" };
        server_request.sendServerRequest("Delete", ajaxData, afterLogout);//remove login session object on server 
        return false;
    }

    function setNavigationBar_LoggedIn(admin) {
        $("#admr-summary").html(admin.admin_name + ", " +  admin.role_name);
        $("#login").hide();
        $("#logout-link").removeClass("hide");
        $("#school-link").removeClass("hide");
        if (admin.role_name !== "sales") { //role sales in not permitted to access Administration menu
            $("#administration-link").removeClass("hide");
            $("#administration-link" ).off().click(function(event) {
                event.preventDefault();
                administration.loadAdminAside();
            });
        }    
        $("#admr-image").removeClass("hide");
        var dt_force_reload = new Date();//way to force browser to reload picture after update of picture
        $("#admr-image").attr("src", app.adminImagePath + admin.admin_id + ".jpg?" + dt_force_reload.getTime());
        $( "#school-link" ).off().click(function(event) {
            event.preventDefault();
            school.loadSchoolAside();
        });
        $(".logout-link").off().click(function(event) {
            event.preventDefault();
            Logout();
        });
    }

    function afterLogin(serverData) {
        if (serverData.status === "error") { 
            alert("error in login - please contact support center ");
            return;
        }
        if (serverData === "no administrator with this email and password found") {
            alert(serverData);
        }
        else { 
            var ao = AdministratorObject();
            var admin  = new ao.Administrator(
                                                serverData.admin_id, 
                                                serverData.admin_name,
                                                serverData.role_id, 
                                                serverData.role_name, 
                                                serverData.admin_phone,
                                                serverData.admin_email);
            sessionStorage.setItem("administrator", JSON.stringify(admin));   
            setNavigationBar_LoggedIn(admin); 
        }
    }

    function handle_login_status(user_login_status) {
        //userLoggedIn = session object on server / sessionStorage.getItem("administrator") on client
        if (user_login_status == "no" || //response from server was that user no longer logged-in
            sessionStorage.getItem("administrator") === null) {  
            $.ajax("templates/login.html").done(function(data) {
                $("#login").empty();
                $("#login").prepend(data);
                
                setNavigationBar_LoggedOut();
                initValidations();
    
                $("#btnLogin").off().click(function() {
                    if (validationsLogin.formValidated.contents.valid()){
                        var formContents = $("form").serialize();
                        server_request.sendServerRequest("Select", formContents, afterLogin); 
                        return false;
                    }
                });
            });
        }
        else { // user logged in set navigation-bar - occurs if user reloads page
            var data = sessionStorage.getItem("administrator");
            var admin = JSON.parse(data);
            setNavigationBar_LoggedIn(admin);
        }
    }

    function getLoginStatus(){
        var ajaxData = { ctrl: "login" };
        server_request.sendServerRequest("Select", ajaxData, handle_login_status); 
    }

    function login(){
        getLoginStatus();
    }

    return {
        handle_login_status : handle_login_status,
        login: login
    };

})();

