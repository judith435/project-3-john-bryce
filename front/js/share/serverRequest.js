"use strict";

var serverRequest = (function() {

    var actionTypes = {};
    actionTypes["Select"] = "GET",
    actionTypes["Add"] = "POST",
    actionTypes["Update"] = "PUT",
    actionTypes["Delete"] = "DELETE";

    function appendInputData(inputData, ajaxData) {
        //because of  image upload new FormData() must be used to send data to server and thus it can no longer be sent simply as $("form").serialize() 
        //the  individual input fields must be appeded to FormData() as key value pairs => statement below creates object from $("form").serialize() containing
        //key value pairs of input data  
        var inputDataPairs = 
        JSON.parse('{"' + decodeURI(inputData.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
        
        for (var key in inputDataPairs) {
            if (inputDataPairs.hasOwnProperty(key)) {
                // if (app.debugMode) {
                //     console.log("sendServerRequest parms from form data serialize  key: " + key + " -> value: " + inputDataPairs[key]);
                // }
                ajaxData.append(key, inputDataPairs[key]);
            }
        }
    }

    function buildDataForPost(inputData, verbChanged, fuImage, imageName) {

        var ajaxData = new FormData();  
        appendInputData(inputData, ajaxData);
        //parm necessary to inform server of verb change to perform on server from POST to PUT 
        if (verbChanged) {
            ajaxData.append("verb_change", "update_with_image");
        }

        if($("#" + fuImage).val()){ //image was selected
            var fileData = $("#" + fuImage).prop("files")[0]; 
            ajaxData.append(imageName, fileData);
        } 
        return ajaxData;
    }

    function callAjax(ajaxData, verb, callBackFunction) {

        // if (app.debugMode) {
        //     console.log("sendServerRequest before call to server");
        //     console.log("ajaxData: " + JSON.stringify( ajaxData) + " verb: " + verb);
        // }
        $.ajax({
            type: verb,
            url: app.schoolApi,
            data: ajaxData,
            contentType: verb === "POST" ? false : undefined,
            processData: verb === "POST" ? false : undefined 
        })
        .done(function(data)
        {
            // if (app.debugMode) {
            //     console.log("sendServerRequest response from server");
            //     console.log(data);
            // }

            var serverResponse = JSON.parse(data);

            //user no longer logged in on server (session no longer exists - make user login again) DON'T call callback method
            if (serverResponse.status === "no longer logged in") { 
                login.setUpLogin(); //user not logged in - redirect user to login page
                return;
            }
            //security breach by administrator sales - DON'T call callback method
            if (serverResponse.status === "administrator sales attempted forbidden action") { 
                alert(serverResponse.status +  "  " + serverResponse.action);
                return;
            }
            //use call back function to ensure ajax request has returned before continuing
            callBackFunction(serverResponse); 
        })
        .fail(function(data){
                alert("problem in sendServerRequest : " + data);
        });
        return false;

    }

    function sendServerRequest( action, 
                                inputData, 
                                callBackFunction,
                                fuImage, //name of input type file control
                                imageName) //name of image in object model
    {
        var verb = actionTypes[action];
        
        var verbChanged = false;
        //image was selected and verb is PUT => must change to POST - images can only be transfered with post
        if($("#" + fuImage).val() && verb === "PUT"){ //image was selected and action = "update" (verb is PUT)
            verb = "POST";
            verbChanged = true;
        } 

        var ajaxData = "";
        if (verb === "POST"){
            ajaxData = buildDataForPost(inputData, verbChanged, fuImage, imageName);
        }
        else { //select -GET , delete - DELETE  & update - PUT without image 
                ajaxData = inputData;
        }

        callAjax(ajaxData, verb, callBackFunction);
    }
        
    return {
             sendServerRequest: sendServerRequest
           };


}());