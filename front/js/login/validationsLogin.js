"use strict"; 

var validationsLogin = (function() {

    var formValidated = {};
    
    function initValidator() {

        formValidated.contents = $("#frmLogin");
        formValidated.validator = formValidated.contents.validate({
            rules:  {
                user_email: {
                    required: true,
                    normalizer: function(value) {
                        return $.trim(value);
                    } 
                }, 
                user_password: {
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

})();

