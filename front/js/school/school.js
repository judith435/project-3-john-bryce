"use strict";

var school = (function() {

    function loadSchoolMain() { 
        $.ajax("templates/school/school-summary.html").done(function(data) {
            $("#main-container").empty();
            $("#main-container").prepend(data);
            courses.showCourses();
            students.showStudents();
        });
    }

    function loadSchoolAside() {
        
        $.ajax("templates/school/schoolAside.html").done(function(data) {
            $("#side-container").empty();
            $("#side-container").prepend(data);
            $("#side-container").addClass("bordered-right");
            
            $(document).off().on("click",".courses-flex #courses tr",function(e){
                courses.courseSelected($(this));
            });

            $(document).on("click",".students-flex #students tr",function(e){
                students.studentSelected($(this));
            });

            if (sessionStorage.getItem("administrator") === null) { //admin session object not found MUST immediately log in again 
                login.setUpLogin();
                return;
            }
            var sessionAdmin = sessionStorage.getItem("administrator");
            var admin = JSON.parse(sessionAdmin);
            if (admin.roleName === "sales") { //administrator type sales is not entitled to update course => hide edit button 
                $("#btnAddCourse").hide();
            }

            $( ".add-button" ).off().click(function() {
                if (this.id === "btnAddCourse"){
                    courses.loadCourseCUD("Add");
                }
                else {  
                    students.loadStudentCUD("Add");
                }
            });
            loadSchoolMain();
        });
    }


    return {

        loadSchoolAside,
        loadSchoolMain
    };

}());


