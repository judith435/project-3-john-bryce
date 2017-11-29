// var login_logout = (function() {
//     function initValidations() {    }        

//     function setNavigationBar_LoggedOut() {    }

//     function afterLogout(serverData) {    }   

//     function Logout(){
//         handleLoginStatus("no"); //set page / navigation bar to logged out state
//         serverRequestModule.sendServerRequest("Delete", ajaxData, afterLogout);//remove login session object on server 
//     }

//     function setNavigationBarLoggedIn(admin) {
//             Logout();
//     }

//     function afterLogin(serverData) {
//             setNavigationBarLoggedIn(admin); 
//     }

//     function handleLoginStatus(user_login_status) {
                
//         setNavigationBar_LoggedOut();
//         initValidations();
//         setNavigationBarLoggedIn(admin);
//     }

//     function getLoginStatus(){
//         server_request.sendServerRequest("Select", ajaxData, handleLoginStatus); 
//     }

//     function login(){
//         getLoginStatus();
//     }


// })();

