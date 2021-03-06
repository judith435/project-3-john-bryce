"use strict"; 

var validationsLogin = (function() {

    var formValidated = {};
    
    function initValidator() {

        formValidated.contents = $("#frmLogin");
        formValidated.validator = formValidated.contents.validate({
            rules:  {
                userEmail: {
                    required: true,
                    normalizer(value) {
                        return $.trim(value);
                    } 
                }, 
                userPassword: {
                    required: true,
                    normalizer(value) {
                        return $.trim(value);
                    } 
                }, 
            }
        });

    }

    return {
        initValidator,
        formValidated
    };

}());

