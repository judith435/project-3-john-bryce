"use strict";
var logout = (function() {
    
    function setNavigationBarLoggedOut() {
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

    function logout(){
        login.setUpLogin(); //set page / navigation bar to logged out state
        var ajaxData = { ctrl: "login" };
        serverRequest.sendServerRequest("Delete", ajaxData, afterLogout);//remove login session object on server 
        return false;
    }

    return {
        setNavigationBarLoggedOut,
        logout
    };

}());
