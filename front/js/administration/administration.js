"use strict";

var administration = (function() {

    var action = {}; //create object (in return statement) that can be referenced by validationsAdministrator.js
    var adminHandled = {};  //create object (in return statement) that can be referenced by validationsAdministrator.js
    var adminLoggedIn;
    var serverRequestModule  = serverRequest; //refernce serverRequest.js file and all its exposed function sendServerRequest
    var commonModule  = common; //refernce common.js file and all its exposed functions
    var validationsAdministratorModule  = validationsAdministrator; //refernce validationsAdministrator.js file and all its exposed functions
    
    
    function setRolesDdlForUpdate(roles) {
        $("#RoleDDL").val(adminHandled.details.roleID);
        //manager/owner may not change his own role
        if(adminLoggedIn.adminID === adminHandled.details.adminID) {  
           $("#RoleDDL").prop("disabled", true);
           $("#role_id").val(adminHandled.details.roleID);//set role in hidden field for server validations
        }
    }

    //fill role combo in input fields with roles retrieved from db in function LoadRoles()
    function buildRolesDDL()   
    {
        var data = sessionStorage.getItem("roles");
        var roles = JSON.parse(data);

        $("#RoleDDL").empty();
        //in case of create Administrator put empty option "Please Select Role" as top element of combo
        if (action.chosen === "Add"){
            $("#RoleDDL").append("<option value=''>Please Select Role</option>");
        }

        for(let i=0; i < roles.length; i++) {
                $("#RoleDDL").append(new Option(roles[i].roleName, roles[i].roleID));
        }

        //disable owner => no new owner may be created or updated to
        var roleOwner = $.grep(roles, function(e){ 
            var lala = e;
            return e.roleName ===  "owner";}); //must retrive id of owner to be able to disable it
        $("option[value='" + roleOwner[0].roleID + "']").attr("disabled", "disabled").siblings().removeAttr("disabled");

        if (action.chosen === "Update"){
            setRolesDdlForUpdate(roles);
        }

        $("#RoleDDL").off().on("change", function() { //save role name selected in hidden input so it can be sent to server
            alert("in  $(#RoleDDL).off().on(change, function()");
            if (adminHandled.details.roleID !== parseInt($("#RoleDDL").val())) {
                 alert (">>> saving role name for server <<<");
                $("#roleName").val($("#RoleDDL option:selected" ).text());
            }
        });
    }

    function initValidations() {//used for jquery validation plugin
        validationsAdministratorModule.initValidator();
        var validationMessages = validationsAdministratorModule.formValidated.validator.settings.messages;
        validationMessages.adminName = "Administrator name required";
        validationMessages.adminPhone = "Valid phone required";
        validationMessages.adminEmail = "Valid email required";
        validationMessages.adminPassword = "Password required";
        validationMessages.roleID = "Please select role";
        validationMessages.adminImage = "Valid extensions: jpg, jpeg, png or gif";
        validationMessages.duplicateAdmin = "Administrator with same name and email found";
    }  

    function buildAdminTable(serverData){
        if (serverData.status === "error") {
            alert("Error occured: " + serverData.message);
            return;
        }
        //build array of administrator objects with data returned from server
        var ao = administratorObject();
        var administratorsArray = [];
        for (let i = 0; i < serverData.length; i++) {
            administratorsArray.push(new ao.Administrator(serverData[i].adminID, 
                                                          serverData[i].adminName,
                                                          serverData[i].roleID, 
                                                          serverData[i].roleName, 
                                                          serverData[i].adminPhone,
                                                          serverData[i].adminEmail
                                        ));
        }     
        
        $.ajax("templates/administration/admin-row.html").done(function(data) {
            $("#administrators").html("");
            $("#totalAdministrators").html("Total number of Administrators: " + administratorsArray.length);
            for(let i=0; i < administratorsArray.length; i++) {
                let template = data;
                //admin data displayed in admin aside
                template = template.replace("{{adminID}}", administratorsArray[i].adminID);
                template = template.replace("{{adminName}}", administratorsArray[i].adminName);
                template = template.replace("{{roleName}}", administratorsArray[i].roleName);
                template = template.replace("{{adminPhone}}", administratorsArray[i].adminPhone);
                template = template.replace("{{adminEmail}}", administratorsArray[i].adminEmail);
                //admin data used to create admin object
                template = template.replace("{{admin-id}}", administratorsArray[i].adminID);
                template = template.replace("{{admin-name}}", administratorsArray[i].adminName);
                template = template.replace("{{role-id}}", administratorsArray[i].roleID);
                template = template.replace("{{role-name}}", administratorsArray[i].roleName);
                template = template.replace("{{admin-phone}}", administratorsArray[i].adminPhone);
                template = template.replace("{{admin-email}}", administratorsArray[i].adminEmail);

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
        if (serverResponse.message.search("following errors") !== -1) { //display msg about failed image upload
                alert("Following message for " + serverResponse.action + ":\n" + serverResponse.message);
        }
        loadAdminMain();
    }  

    function deleteAdmin(ajaxData) {
        var confirmation = confirm("Are you sure you want to delete administrator number " + adminHandled.details.adminID + "?");
        if (confirmation === true) {
            // don't perform validations in case of delete
            serverRequestModule.sendServerRequest("Delete", ajaxData, afterSave);  
            return false;
        }
    }

    function btnSaveHandler() {
        
        $(".btnSave").off().click(function() {
            var verb;
            var ajaxData = $("#frmCUD").serialize();

            if(this.id === "btnDelete"){ 
                deleteAdmin(ajaxData);
                return;
            } 

            verb =  action.chosen === "Add" ? "Add" : "Update"; 
            if (validationsAdministratorModule.formValidated.contents.valid()){
                serverRequestModule.sendServerRequest
                        (verb, ajaxData, afterSave, "adminImage", "adminImage");  
                return false;
            }
        });
    }

    //save roles retrieved in session storage to avoid repeated calls to db for same date
    // (roles are predefined and are not liable to change)
    function callbackSaveRoles(roles)   
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
                serverRequestModule.sendServerRequest("Select", ajaxData, callbackSaveRoles); 
            }
            else {
                buildRolesDDL();
            }
            initValidations();
            btnSaveHandler();
            if(action.chosen === "Update"){
                //place details of administrator being updated in input fields
                $("#cud-admin-title").html( "Update Administrator Number: " + adminHandled.details.adminID);
                $("#adminID").val(adminHandled.details.adminID);//set adminID in hidden field for update/delete
                $("#adminName").val(adminHandled.details.adminName);
                $("#adminPhone").val(adminHandled.details.adminPhone); 
                $("#adminEmail").val(adminHandled.details.adminEmail); 
                //password cannot be updated - it is also not retrived from db to be displayed
                $("#adminPassword").val("***************"); 
                $("#adminPassword").prop("disabled", true);

                var dtForceReload = new Date();//way to force browser to reload picture after update of picture
                var imgPath = app.adminImagePath + adminHandled.details.adminID + ".jpg?" + dtForceReload.getTime();
                commonModule.setCanvas($("#canvasAdmin")[0], imgPath, "regular");

                if(adminLoggedIn.adminID === adminHandled.details.adminID) { //administrator cannot delete himself
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

    function adminSelected(row) {
        var adminID = row.find("#admin-id").text();
        var adminName = row.find("#admin-name").text(); 
        var adminRoleID = row.find("#admin-role-id").text();
        var adminRoleName = row.find("#admin-role-name").text();
        var adminPhone = row.find("#admin-phone").text();
        var adminEmail = row.find("#admin-email").text();
        var ao =  administratorObject();
        adminHandled.details = new ao.Administrator(parseInt(adminID), 
                                                    adminName, 
                                                    parseInt(adminRoleID), 
                                                    adminRoleName, 
                                                    adminPhone, 
                                                    adminEmail);
        loadAdminCUD("Update"); 
    }

    var loadAdminAside = function () {//called from login.js => event when admin clicks link button
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
    };

    return {
        loadAdminAside, //function: used by login.js
        adminHandled, //data: used by validationsAdministrator.js
        action  //data: used by validationsAdministrator.js
    };

}());
