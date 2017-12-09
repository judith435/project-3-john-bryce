"use strict";

var students = (function() {

    var studentArray = [];
    var studentHandled = {};  //create object (in return statement) that can be referenced by validationsStudent.js
    var studentsRetrieved = {};

    function displayStudentImage(){
        var dtForceReload = new Date();//way to force browser to reload picture after update of picture
        var imgPath = app.studentImagePath + studentHandled.details.studentID + ".jpg?" + dtForceReload.getTime();
        common.setCanvas($("#canvasStudent")[0], imgPath, "regular");
    }

    function buildCoursesCBL() {
        var container = $("#cblistCourses");
        var id = 1;
        for (let i = 0; i < courses.courseArray.length; i++) {
            $("<input/>",
             { type: "checkbox", id: "cbCourse" + courses.courseArray[i].courseID, 
                                 value: courses.courseArray[i].courseName,
                                 name: "cbCourse" + courses.courseArray[i].courseID }).appendTo(container);
            $("<span/>", { text: courses.courseArray[i].courseName }).appendTo(container);
            $("<br />").appendTo(container);
        }
    }

    function buildStudentTable(serverData){
        if (serverData.status === "error") {
            alert("Error occured: " + serverData.message);
            return;
        }
        //build array of student objects with data returned from server
        var so = studentObject();
        studentArray.length = 0; //clear data from previous calls to buildStudentTable
        for (let i = 0; i < serverData.length; i++) {
            studentArray.push(new so.Student(serverData[i].studentID, 
                                              serverData[i].studentName,
                                              serverData[i].studentPhone, 
                                              serverData[i].studentEmail,
                                              serverData[i].studentCourses 
                                            ));
        }  
        studentsRetrieved.status = true;
        $.ajax("templates/school/students/student-row.html").done(function(data) {
            $("#students").html("");
            $("#totalStudents").html("Total number of Students: " + studentArray.length);
            //after loading students table row template append data from 1 student object to each row
            for(let i=0; i < studentArray.length; i++) {
                let template = data;
                //student data displayed in school aside
                template = template.replace("{{studentID}}", studentArray[i].studentID);
                template = template.replace("{{studentName}}", studentArray[i].studentName);
                template = template.replace("{{studentPhone}}", studentArray[i].studentPhone);
                //student data used to create student object
                template = template.replace("{{student-id}}", studentArray[i].studentID);
                template = template.replace("{{student-name}}", studentArray[i].studentName);
                template = template.replace("{{student-phone}}", studentArray[i].studentPhone);
                template = template.replace("{{student-email}}", studentArray[i].studentEmail);
                template = template.replace("{{student-courses}}", studentArray[i].studentCourses);
                $("#students").append(template);
            }
            common.loadCanvasList($("#students canvas"), app.studentImagePath, "schoolAside");
        });
    }    

    function showStudents(){
        var ajaxData = { ctrl: "student" };
        studentsRetrieved.status = false;
        serverRequest.sendServerRequest("Select", ajaxData, buildStudentTable); 
        return false;
    }

    function loadStudentCUD(action) {
        $.ajax("templates/school/students/cud-student.html").done(function(data) {
            $("#cud-student-title").empty();
            $("#main-container").empty();
            $("#main-container").prepend(data);
            studentSave.initValidations();
            studentSave.btnSaveHandler(action);
            buildCoursesCBL(); //build checkboxlist of all courses
            if(action === "Update"){
                //place name and description of student being updated in input field
                $("#cud-student-title").html( "Update Student Number: " + studentHandled.details.studentID);
                $("#studentID").val(studentHandled.details.studentID);//set studentID in hidden field for update/delete
                $("#studentName").val(studentHandled.details.studentName);
                $("#studentPhone").val(studentHandled.details.studentPhone); 
                $("#studentEmail").val(studentHandled.details.studentEmail); 

                //check course checkbox if student registered for specific course
                if (studentHandled.details.studentCourses !== "") {
                    var courses = studentHandled.details.studentCourses.split(",");
                    for (let i = 0; i < courses.length; i++) {
                        document.getElementById(courses[i]).checked = true;
                    }
                }
                displayStudentImage();
            }
            else {
                    $("#cud-student-title").html(action + " Student");
                    $("#btnDelete").hide(); 
                    $("#cbDeleteImage").hide(); 
                }

            $("#studentImage").change(function() {
                common.uploadImage($("#canvasStudent")[0], this);
            });

            $("#btnCancel").off().click(function() {
                common.clearImage($("#canvasStudent")[0], $("#studentImage")[0]);
            });

        });
    }

    function loadStudentView() {
        $.ajax("templates/school/students/view-student.html").done(function(data) {
            $("#main-container").empty();
            $("#main-container").prepend(data);
            $("#studentName").html(studentHandled.details.studentName);
            $("#studentPhone").html(studentHandled.details.studentPhone); 
            $("#studentEmail").html(studentHandled.details.studentEmail); 
            if (studentHandled.details.studentCourses !== "") {// studentCourses == "" - no courses found for student being handled
                var container = $("#courseList");
                var courseHtml = "";
                var studentCourses = studentHandled.details.studentCourses.split(",");
                for (let i = 0; i < studentCourses.length; i++) {
                    let courseID = parseInt(studentCourses[i].replace("cbCourse",""));
                    let course = $.grep(courses.courseArray, function(e){ return e.courseID === courseID; });
                    courseHtml += "<div class='info-row-minor'>";
                    courseHtml += "<canvas  data-canvas-id='" + courseID + "' class='img-fluid info-minor' width='40' height='50' ></canvas>";
                    courseHtml += "<div class='info-container'>";
                    courseHtml += "<label class='text-left'>" + course[0].courseName + "</label>";
                    courseHtml += "</div>";
                    courseHtml += "</div>";
                }
                $("#courseList").append(courseHtml);
                //load images for all canvas elements created
                common.loadCanvasList($("#courseList canvas"), app.courseImagePath, "small");
            }
            displayStudentImage();
            $("#btnEdit").off().click(function() {
                loadStudentCUD("Update"); 
            });

        });
    }

    function studentSelected(row)
    {
        var studentID = row.find("#student-id").text();
        var studentName = row.find("#student-name").text(); 
        var studentPhone = row.find("#student-phone").text();
        var studentEmail = row.find("#student-email").text();
        var studentCourses = row.find("#student-courses").text();
        var so = studentObject();
        studentHandled.details = new so.Student(parseInt(studentID), 
                                                studentName, 
                                                studentPhone, 
                                                studentEmail, 
                                                studentCourses);
        loadStudentView();
    }

    return {

        loadStudentCUD,  //function: used by school.js
        loadStudentView,  //function: used by studentSave.js
        showStudents, //function: used by school.js/courses.js
        studentSelected, //fucntion: used by school.js
        studentArray,//data: used by courses.js to build list of students in view-course.html
        studentsRetrieved, //data: flag used to signal to course.js that building studentArray has completed after course update 
        studentHandled //data: student data used by validationsStudent.js 
    };

}());


