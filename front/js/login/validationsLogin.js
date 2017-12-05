"use strict"; 

var validationsLogin = (function() {

    var formValidated = {};
    
    function initValidator() {

        formValidated.contents = $("#frmLogin");
        formValidated.validator = formValidated.contents.validate({
            rules:  {
                userEmail: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                }, 
                userPassword: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                }, 
            }
        });

    }

    return {
        initValidator: initValidator,
        formValidated: formValidated
    };

}());

