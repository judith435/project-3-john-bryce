"use strict"

var server_request = (function() {

    function sendServerRequest( action, 
                                input_data, 
                                CallBack_function,
                                fuImage, //name of input type file control
                                image_name) //name of image in object model
    {
        var verb;
        switch (action) {
            case "Select":
                verb = "GET";
                break;
            case "Add":
                verb = "POST";
                break;
            case "Update":
                verb = "PUT";
                break;
            case "Delete":
                verb = "DELETE";
                break;
        }

        var verb_changed = false;
        //image was selected and verb is PUT => must change to POST - images can only be transfered with post
        if($("#" + fuImage).val() && verb == "PUT"){ //image was selected and action = "update" (verb is PUT)
            verb = "POST";
            verb_changed = true;
        } 

        var ajaxData = "";
        if (verb === "POST"){
            ajaxData = new FormData();    
            //because of  image upload new FormData() must be used to send data to server and thus it can no longer be sent simply as $("form").serialize() 
            //the  individual input fields must be appeded to FormData() as key value pairs => statement below creates object from $("form").serialize() containing
            //key value pairs of input data  
            var input_data_pairs = JSON.parse('{"' + decodeURI(input_data.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}')
            for (var key in input_data_pairs) {
                if (input_data_pairs.hasOwnProperty(key)) {
                    if (app.debugMode) {
                        console.log("sendServerRequest parms from form data serialize  key: " + key + " -> value: " + input_data_pairs[key]);
                    }
                    ajaxData.append(key, input_data_pairs[key]);
                }
            }

            //parm necessary to inform server of verb change to perform on server from POST to PUT 
            if (verb_changed) {
                ajaxData.append("verb_change", "update_with_image");
            }

            if($("#" + fuImage).val()){ //image was selected
                var file_data = $("#" + fuImage).prop('files')[0]; 
                ajaxData.append(image_name, file_data);
            } 
        }
        else { //select -GET , delete - DELETE  & update - PUT without image 
                ajaxData = input_data;
        }

        if (app.debugMode) {
            console.log("sendServerRequest before call to server");
            console.log("ajaxData: " + JSON.stringify( ajaxData) + " verb: " + verb);
        }

        $.ajax({
            type: verb,
            url: app.schoolApi,
            data: ajaxData,
            contentType: verb === "POST" ? false : undefined,
            processData: verb === "POST" ? false : undefined 
        })
        .done(function(data)
        {
            if (app.debugMode) {
                console.log("sendServerRequest response from server");
                console.log(data);
            }

            var serverResponse = JSON.parse(data);

            //user no longer logged in on server (session no longer exists - make user login again) DON'T call callback method
            if (serverResponse.status === "no longer logged in") { 
                login_logout.handle_login_status("no"); //no = user not logged in
                return;
            }
            //security breach by administrator sales - DON'T call callback method
            if (serverResponse.status === "administrator sales attempted forbidden action") { 
                alert(serverResponse.status +  "  " + serverResponse.action);
                return;
            }
            //use call back function to ensure ajax request has returned before continuing
            CallBack_function(serverResponse); 
        })
        .fail(function(data){
                console.log("error in sendServerRequest");
                console.log(data);
                alert("problem in ajax : " + data);
        })
        return false;
    }
        
    return {
             sendServerRequest: sendServerRequest
           };


})();
