"use strict";
var loginHandling = (function() {

    var serverRequestModule  = serverRequest; //refernce serverRequest.js file and all its exposed function sendServerRequest
    
    function handleLoginStatus(userLoginStatus) {
        //userLoggedIn = session object on server / sessionStorage.getItem("administrator") on client
        if (userLoginStatus === "no" || //response from server was that user no longer logged-in
            sessionStorage.getItem("administrator") === null) {  
                login.setUpLogin();
        }
        else { // user logged in set navigation-bar - occurs if user reloads page
            var data = sessionStorage.getItem("administrator");
            var admin = JSON.parse(data);
            login.setNavigationBarLoggedIn(admin);
        }
    }

    function getLoginStatus(){ //first function to run when page is loaded
        var ajaxData = { ctrl: "login" };
        serverRequest.sendServerRequest("Select", ajaxData, handleLoginStatus); 
    }

    return {
        getLoginStatus
    };

}());
