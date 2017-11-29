// var login_logout = (function() {
//     function initValidations() {    }        

//     function setNavigationBar_LoggedOut() {    }

//     function afterLogout(serverData) {    }   

//     function Logout(){
//         handle_login_status("no"); //set page / navigation bar to logged out state
//         serverRequestModule.sendServerRequest("Delete", ajaxData, afterLogout);//remove login session object on server 
//     }

//     function setNavigationBar_LoggedIn(admin) {
//             Logout();
//     }

//     function afterLogin(serverData) {
//             setNavigationBar_LoggedIn(admin); 
//     }

//     function handle_login_status(user_login_status) {
                
//         setNavigationBar_LoggedOut();
//         initValidations();
//         setNavigationBar_LoggedIn(admin);
//     }

//     function getLoginStatus(){
//         server_request.sendServerRequest("Select", ajaxData, handle_login_status); 
//     }

//     function login(){
//         getLoginStatus();
//     }


// })();

