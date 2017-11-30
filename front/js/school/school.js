"use strict";

var school = (function() {

    var coursesModule  = courses;//refernce courses.js file and all its exposed functions
    var studentsModule  = students;//refernce students.js file and all its exposed functions
    var LoginLogoutModule  = loginLogout;//refernce validationsCourse.js file and all its exposed functions
    
    function loadSchoolMain() { 
        $.ajax("templates/school/school-summary.html").done(function(data) {
            $("#main-container").empty();
            $("#main-container").prepend(data);
            coursesModule.showCourses();
            studentsModule.showStudents();
        });
    }

    function loadSchoolAside() {
        
        $.ajax("templates/school/schoolAside.html").done(function(data) {
            $("#side-container").empty();
            $("#side-container").prepend(data);
            $("#side-container").addClass("bordered-right");
            
            $(document).off().on("click",".courses-flex #courses tr",function(e){
                coursesModule.courseSelected($(this));
            });

            $(document).on("click",".students-flex #students tr",function(e){
                studentsModule.studentSelected($(this));
            });

            if (sessionStorage.getItem("administrator") === null) { //admin session object not found MUST immediately log in again 
                LoginLogoutModule.login();
                return;
            }
            var sessionAdmin = sessionStorage.getItem("administrator");
            var admin = JSON.parse(sessionAdmin);
            if (admin.role_name === "sales") { //administrator type sales is not entitled to update course => hide edit button 
                $("#btnAddCourse").hide();
            }

            $( ".add-button" ).off().click(function() {
                if (this.id === "btnAddCourse"){
                    coursesModule.loadCourseCUD("Add");
                }
                else {  
                    studentsModule.loadStudentCUD("Add");
                }
            });
            loadSchoolMain();
        });
    }


    return {

        loadSchoolAside: loadSchoolAside,
        loadSchoolMain: loadSchoolMain
    };

})();


