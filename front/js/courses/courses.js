"use strict";

var courses = (function() {

    var courseHandled = {}; //course data also used by validationsCourse.js 
    var courseArray = [];
    var coursesRetrieved = {}; //flag used by student.js which needs to know if all courses have been retrieved
    var serverRequestModule  = serverRequest; //refernce serverRequest.js file and all its exposed function sendServerRequest
    var commonModule  = common; //refernce common.js file and all its exposed functions
    
    function  displayCourseImage(){
        var dtForceReload = new Date();//way to force browser to reload picture after update of picture
        var imgPath = app.courseImagePath + courseHandled.details.course_id + ".jpg?" + dtForceReload.getTime();
        commonModule.setCanvas($("#canvasCourse")[0], imgPath, "regular");
    }

          
    function buildCourseTable(serverData){
        if (serverData.status === "error") {
            alert("Error occured: " + serverData.message);
            return;
        }
        //build array of course objects with data returned from server
        var co = courseObject();
        courseArray.length = 0; //clear data from previous calls to buildCourseTable
        for (let i = 0; i < serverData.length; i++) {
            courseArray.push(new co.Course(serverData[i].course_id, 
                                           serverData[i].course_name,
                                           serverData[i].course_description, 
                                           serverData[i].number_of_students_for_course, 
                                           serverData[i].student_ids
                                        ));
        } 

        coursesRetrieved.status = true;

        $.ajax("templates/school/courses/course-row.html").done(function(data) {
            $("#courses").html("");
            $("#totalCourses").html("Total number of Courses: " + courseArray.length);
            //after loading courses table row template append data from 1 course object to each row
            for(let i=0; i < courseArray.length; i++) {
                let template = data;
                //course data displayed in school aside
                template = template.replace("{{course_id}}", courseArray[i].course_id);
                template = template.replace("{{course_name}}", courseArray[i].course_name);
                template = template.replace("{{number_of_students_for_course}}", courseArray[i].number_of_students_for_course);
                //course data used to create course object
                template = template.replace("{{course-id}}", courseArray[i].course_id);
                template = template.replace("{{course-name}}", courseArray[i].course_name);
                template = template.replace("{{course-description}}", courseArray[i].course_description);
                template = template.replace("{{number-of-students-for-course}}", courseArray[i].number_of_students_for_course);
                template = template.replace("{{student-ids}}", courseArray[i].student_ids);
                $("#courses").append(template);
            }
            commonModule.loadCanvasList($("#courses canvas"), app.courseImagePath, "schoolAside");
        });
    }

    function showCourses(){
        var ajaxData = { ctrl: "course" };
        coursesRetrieved.status = false;
        serverRequestModule.sendServerRequest("Select", ajaxData, buildCourseTable); 
        return false;
    }
    
    function loadCourseCUD(action) {
        $.ajax("templates/school/courses/cud-course.html").done(function(data) {
            $("#cud-course-title").empty();
            $("#main-container").empty();
            $("#main-container").prepend(data);
            courseSave.initValidations();
            courseSave.btnSaveHandler(action);
            if(action === "Update"){
                //place name and description of course being updated in input field
                $("#cud-course-title").html( "Update Course Number: " + courseHandled.details.course_id);
                $("#courseID").val(courseHandled.details.course_id);//set course_id in hidden field for update/delete
                $("#courseName").val(courseHandled.details.course_name);
                $("#courseDescription").val(courseHandled.details.course_description); 
                if (courseHandled.details.number_of_students_for_course > 0){ //course has been assigned to students cannot be deleted
                    $("#btnDelete").hide(); 
                }
                 displayCourseImage();
                $("#studentTotal").html("Total " + courseHandled.details.number_of_students_for_course + " students taking this course");
            }
            else {//create
                    $("#cud-course-title").html(action + " Course");
                    $("#btnDelete").hide(); 
                    $("#cbDeleteImage").hide(); 
                }

            $("#courseImage").change(function() {
                commonModule.uploadImage($("#canvasCourse")[0], this);
            });

            $("#btnCancel").off().click(function() {
                commonModule.clearImage($("#canvasCourse")[0], $("#courseImage")[0]);
            });
        });
    }

    function buildStudentList() {
        var studentHtml = "";
        var studentIDs = courseHandled.details.student_ids.split(",");
        for (let i = 0; i < studentIDs.length; i++) {
                let student = $.grep(students.studentArray, function(e){ return e.student_id ==  studentIDs[i];});
                studentHtml += "<div class='info-row-minor'>";
                studentHtml += "<canvas  data-canvas-id='" + studentIDs[i] + "' class='img-fluid info-minor' width='40' height='50' ></canvas>";
                studentHtml += "<div class='info-container'>";
                studentHtml += "<label class='text-left'>" + student[0].student_name + "</label>";
                studentHtml += "</div>";
                studentHtml += "</div>";
        }
        $("#studentList").append(studentHtml);
        //load images for all canvas elements created
        commonModule.loadCanvasList($("#studentList canvas"), app.studentImagePath, "small");
    }

    function loadCourseView() {
        
        $.ajax("templates/school/courses/view-course.html").done(function(data) {
            $("#main-container").empty();
            $("#main-container").prepend(data);
            var studentNumbers = courseHandled.details.number_of_students_for_course == 0 ? "no" :  courseHandled.details.number_of_students_for_course ;
            var courseText = courseHandled.details.course_name + ", " + studentNumbers + " students";
            $("#courseName").html(courseText);
            $("#CourseDescription").html(courseHandled.details.course_description); 

            if (courseHandled.details.student_ids !== "") {// student_ids == "" - no students found for course being handled
                buildStudentList();
            }

            //get admin data to check if admin role is sales => may not update course data
            if (sessionStorage.getItem("administrator") === null) {//admin session object not found MUST immediately log in agaןn 
                login.setUpLogin();
                return;
            }
            var sessionAdmin = sessionStorage.getItem("administrator");
            var admin = JSON.parse(sessionAdmin);
            if (admin.role_name === "sales") { //administrator type sales is not entitled to update course => hide edit button 
                $("#btnEdit").hide();
            }
            displayCourseImage();
            $("#btnEdit").off().click(function() {
                loadCourseCUD("Update"); 
            });

        });
    }

    function courseSelected(row)  {
        var courseID = row.find("#course-id").text();
        var courseName = row.find("#course-name").text(); 
        var courseDescr= row.find("#course-description").text();
        var studentCourse = row.find("#number-of-students-for-course").text();
        var studentIDs = row.find("#student-ids").text();
        var co = courseObject();
        courseHandled.details = new co.Course(courseID, courseName, courseDescr, studentCourse, studentIDs);
        loadCourseView();
    }

    return {

        loadCourseCUD: loadCourseCUD, //function:  used by school.js
        loadCourseView: loadCourseView, //function:  used by courseSave.js
        showCourses: showCourses, //function: used by school.js/students.js/courseSave.js
        courseSelected: courseSelected, //fucntion: used by school.js
        courseArray : courseArray, //data: used by students.js to build course checkboxlist
        coursesRetrieved: coursesRetrieved, //data: flag used to signal to student.js that building courseArray has completed after student update 
        courseHandled : courseHandled, //data: course data used by validationsCourse.js 
    };

}());


