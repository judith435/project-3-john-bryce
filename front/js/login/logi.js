// var loginLogout = (function() {
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

//     function handleLoginStatus(userLoginStatus) {
                
//         setNavigationBar_LoggedOut();
//         initValidations();
//         setNavigationBarLoggedIn(admin);
//     }

//     function getLoginStatus(){
//         serverRequest.sendServerRequest("Select", ajaxData, handleLoginStatus); 
//     }

//     function login(){
//         getLoginStatus();
//     }


// })();

