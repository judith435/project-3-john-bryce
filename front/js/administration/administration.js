"use strict";

var administration = (function() {

    var action = {}; //create object (in return statement) that can be referenced by validationsAdministrator.js
    var adminHandled = {};  //create object (in return statement) that can be referenced by validationsAdministrator.js
    var adminLoggedIn;
    var serverRequestModule  = serverRequest; //refernce serverRequest.js file and all its exposed function sendServerRequest
    var commonModule  = common; //refernce common.js file and all its exposed functions
    var validationsAdministratorModule  = validationsAdministrator; //refernce validationsAdministrator.js file and all its exposed functions
    

    //fill role combo in input fields with roles retrieved from db in function LoadRoles()
    function buildRolesDDL()   
    {
        var data = sessionStorage.getItem("roles");
        var roles = JSON.parse(data);

        $("#RoleDDL").empty();
        if (action.chosen === "Add"){
            $("#RoleDDL").append("<option value=''>Please Select Role</option>");
        }

        //in case of create Administrator put empty option "Please Select Role" as top element of combo
        for(let i=0; i < roles.length; i++) {
                $("#RoleDDL").append(new Option(roles[i].role_name, roles[i].role_id));
        }

        if (action.chosen === "Update"){
            $("#RoleDDL").val(adminHandled.details.role_id);

            //manager/owner may not change his own role
            if(adminLoggedIn.admin_id == adminHandled.details.admin_id) {  
                $("#RoleDDL").prop("disabled", true);
            }
            else { //or change  another managers role to owner - make owner unselectable in RoleDDL
                var role_owner = $.grep(roles, function(e){ return e.role_name ===  "owner";}); //must retrive id of owner to be able to disable it
                $("option[value='" + role_owner[0].role_id + "']").attr("disabled", "disabled").siblings().removeAttr("disabled");
            }
        }

        $("#RoleDDL").off().on("change", function() { //save role name selected in hidden input so it can be sent to server
            $("#roleName").val($("#RoleDDL option:selected" ).text());
        });
    }
    
    function initValidations() {//used for jquery validation plugin
        validationsAdministratorModule.initValidator();
        var validationMessages = validationsAdministratorModule.formValidated.validator.settings.messages;
        validationMessages.admin_name = "Administrator name required";
        validationMessages.admin_phone = "Valid phone required";
        validationMessages.admin_email = "Valid email required";
        validationMessages.admin_password = "Password required";
        validationMessages.role_id = "Please select role";
        validationMessages.admin_image = "Valid extensions: jpg, jpeg, png or gif";
        validationMessages.duplicate_admin = "Administrator with same name and email already exists";
    }  

    function buildAdminTable(serverData){
        if (serverData.status === "error") {
            alert("Error occured: " + serverData.message);
            return;
        }
        //build array of administrator objects with data returned from server
        var ao = new AdministratorObject();
        var administratorsArray = [];
        for (let i = 0; i < serverData.length; i++) {
            administratorsArray.push(new ao.Administrator(serverData[i].admin_id, 
                                                          serverData[i].admin_name,
                                                          serverData[i].role_id, 
                                                          serverData[i].role_name, 
                                                          serverData[i].admin_phone,
                                                          serverData[i].admin_email
                                        ));
        }     
        
        $.ajax("templates/administration/admin-row.html").done(function(data) {
            $("#administrators").html("");
            $("#totalAdministrators").html("Total number of Administrators: " + administratorsArray.length);
            for(let i=0; i < administratorsArray.length; i++) {
                let template = data;
                //admin data displayed in admin aside
                template = template.replace("{{admin_id}}", administratorsArray[i].admin_id);
                template = template.replace("{{admin_name}}", administratorsArray[i].admin_name);
                template = template.replace("{{role_name}}", administratorsArray[i].role_name);
                template = template.replace("{{admin_phone}}", administratorsArray[i].admin_phone);
                template = template.replace("{{admin_email}}", administratorsArray[i].admin_email);
                //admin data used to create admin object
                template = template.replace("{{admin-id}}", administratorsArray[i].admin_id);
                template = template.replace("{{admin-name}}", administratorsArray[i].admin_name);
                template = template.replace("{{role-id}}", administratorsArray[i].role_id);
                template = template.replace("{{role-name}}", administratorsArray[i].role_name);
                template = template.replace("{{admin-phone}}", administratorsArray[i].admin_phone);
                template = template.replace("{{admin-email}}", administratorsArray[i].admin_email);

                $("#administrators").append(template);
            }
            commonModule.loadCanvasList($("#administrators canvas"), app.adminImagePath, "adminAside");
        });
    }

    function showAdministrators(){
        var ajaxData = { ctrl: "administrator" };
        serverRequestModule.sendServerRequest("Select", ajaxData, buildAdminTable); 
        return false;
    }

    function loadAdminMain() { 
        $.ajax("templates/administration/admin-summary.html").done(function(data) {
            $("#main-container").empty();
            $("#main-container").prepend(data);
            showAdministrators();
        });
    }

    function afterSave(serverResponse) {
        if (serverResponse.status === "error") {
            alert("Following error(s) occured in " + serverResponse.action + ":\n" + serverResponse.message);
            return;
        }
        if (serverResponse.message.search("following errors") != -1) { //display msg about failed image upload
                alert("Following message for " + serverResponse.action + ":\n" + serverResponse.message);
        }
        loadAdminMain();
    }  

    function btnSaveHandler() {
        
        $(".btnSave").off().click(function() {
            var verb;
            //update:  check role combo value was changed - action that could be illegal
            //if not initialize roleName (hidden field for use on server) to prevent faulty validations on server 
            if (action.chosen === "Update") {
                if (adminHandled.details.role_id == $("#RoleDDL").val().trim()) {
                    $("#roleName").val($("").text());
                }
            }
            var ajaxData = $("#frmCUD").serialize();

            if(this.id === "btnDelete"){ // don't perform validations in case of delete
                var confirmation = confirm("Are you sure you want to delete administrator number " + adminHandled.details.admin_id + "?");
                if (confirmation == true) {
                    verb = "Delete";
                    serverRequestModule.sendServerRequest(verb, ajaxData, afterSave, "adminImage", "admin_image");  
                    return false;
                }
            }   
            else {
                verb =  action.chosen === "Add" ? "Add" : "Update"; 
                if (validationsAdministratorModule.formValidated.contents.valid()){
                    serverRequestModule.sendServerRequest
                            (verb, ajaxData, afterSave, "adminImage", "admin_image");  
                    return false;
                }
            }
        });
    }

    //save roles retrieved in session storage to avoid repeated calls to db for same date
    // (roles are predefined and are not liable to change)
    function callback_Save_Roles(roles)   
    {   
        sessionStorage.setItem("roles", JSON.stringify(roles));
        buildRolesDDL();   
    }   

    function loadAdminCUD() {//admin update panel
        $.ajax("templates/administration/cud-admin.html").done(function(data) {
            $("#cud-admin-title").empty();
            $("#main-container").empty();
            $("#main-container").prepend(data);
            if (sessionStorage.getItem("roles") == null) {
                var ajaxData = { ctrl: "role" };
                serverRequestModule.sendServerRequest("Select", ajaxData, callback_Save_Roles); 
            }
            else {
                buildRolesDDL();
            }
            initValidations();
            btnSaveHandler();
            if(action.chosen === "Update"){
                //place details of administrator being updated in input fields
                $("#cud-admin-title").html( "Update Administrator Number: " + adminHandled.details.admin_id);
                $("#adminID").val(adminHandled.details.admin_id);//set admin_id in hidden field for update/delete
                $("#adminName").val(adminHandled.details.admin_name);
                $("#adminPhone").val(adminHandled.details.admin_phone); 
                $("#adminEmail").val(adminHandled.details.admin_email); 
                //password cannot be updated - it is also not retrived from db to be displayed
                $("#adminPassword").val("***************"); 
                $("#adminPassword").prop("disabled", true);
                //set role_id in hidden field for update - used on server to check if manager is trying to change his own role
                $("#roleID").val(adminHandled.details.role_id);

                var dtForceReload = new Date();//way to force browser to reload picture after update of picture
                var imgPath = app.adminImagePath + adminHandled.details.admin_id + ".jpg?" + dtForceReload.getTime();
                commonModule.setCanvas($("#canvasAdmin")[0], imgPath, "regular");

                if(adminLoggedIn.admin_id == adminHandled.details.admin_id) { //administrator cannot delete himself
                  $("#btnDelete").hide(); 
                }
            }
            else {
                    $("#cud-admin-title").html(action.chosen + " Administrator");
                    $("#btnDelete").hide(); 
                    $("#cbDeleteImage").hide(); 
            }

            
            $("#adminImage").change(function() {
                commonModule.uploadImage($("#canvasAdmin")[0], this);
            });

            $("#btnCancel").off().click(function() {
                commonModule.clearImage($("#canvasAdmin")[0], $("#adminImage")[0]);
            });

        });
    }

    function adminSelected(row)
    {
        var adminID = row.find("#admin-id").text();
        var adminName = row.find("#admin-name").text(); 
        var adminRoleID = row.find("#admin-role-id").text();
        var adminRoleName = row.find("#admin-role-name").text();
        var adminPhone = row.find("#admin-phone").text();
        var adminEmail = row.find("#admin-email").text();
        var ao = new AdministratorObject();
        adminHandled.details = new ao.Administrator(adminID, adminName, adminRoleID, adminRoleName, adminPhone, adminEmail);
        loadAdminCUD("Update"); 
    }

    function loadAdminAside() {//called from login_logout.js => event when admin clicks link button
        var data = sessionStorage.getItem("administrator");
        adminLoggedIn = JSON.parse(data);
    
        $.ajax("templates/administration/admin-aside.html").done(function(data) {
            $("#side-container").empty();
            $("#side-container").prepend(data);
            $("#side-container").addClass("bordered-right");

            $(document).off().on("click","#administrators tr",function(e){
                action.chosen = "Update";
                adminSelected($(this));
            });

            $( "#btnAddAdmin" ).off().click(function() {
                action.chosen = "Add";
                loadAdminCUD();
            });
            loadAdminMain();
        });
    }

    return {
        loadAdminAside: loadAdminAside, //function: used by login_logout.js
        adminHandled: adminHandled, //data: used by validationsAdministrator.js
        action: action  //data: used by validationsAdministrator.js
    };

})();
