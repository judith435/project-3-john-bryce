'use strict'
//entry point for entire application - jQuery(document).ready(function()  is first thing to run

//global variables used by all js files
var app = {
    debugMode: false,   
    schoolApi: 'http://localhost/project-3-john-bryce/back/api/api.php',
    schoolImageFolder: 'http://localhost/project-3-john-bryce/back/images',
}

jQuery(document).ready(function() {
    $.ajax('templates/navigation.html').done(function(data) {
        $('#navigation-bar').prepend(data);
        login_logout.login();    
    });
})