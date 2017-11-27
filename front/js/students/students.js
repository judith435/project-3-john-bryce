"use strict"

var students = (function() {

    var studentArray = [];
    var student_action = {}; //create object (in return statement) that can be referenced by validationsStudent.js - validations need to know whether update or insert
    var studentHandled = {};  //create object (in return statement) that can be referenced by validationsStudent.js
    var students_retrieved = {};
    
    function loadStudentView() {
        $.ajax("templates/school/students/view-student.html").done(function(data) {
            $("#main-container").empty();
            $("#main-container").prepend(data);
            $("#studentName").html(studentHandled.details.student_name);
            $("#studentPhone").html(studentHandled.details.student_phone); 
            $("#studentEmail").html(studentHandled.details.student_email); 
            if (studentHandled.details.student_courses != "") {// student_courses == "" - no courses found for student being handled
                var container = $("#courseList");
                var courseHtml = "";
                var studentCourses = studentHandled.details.student_courses.split(',');
                for (let i = 0; i < studentCourses.length; i++) {
                    let course_id = studentCourses[i].replace('cbCourse','');
                    let course = $.grep(courses.courseArray, function(e){ return e.course_id == course_id; });
                    courseHtml += '<div class="info-row-minor">';
                    courseHtml += '<canvas  data-canvas-id="' + course_id + '" class="img-fluid info-minor" width="40" height="50" ></canvas>';
                    courseHtml += '<div class="info-container">';
                    courseHtml += '<label class="text-left">' + course[0].course_name + '</label>';
                    courseHtml += '</div>';
                    courseHtml += '</div>';
                }
                $("#courseList").append(courseHtml);
                //load images for all canvas elements created
                common.loadCanvasList($("#courseList canvas"), app.courseImagePath, "small");
            }
            display_student_image();
            $("#btnEdit").off().click(function() {
                loadStudentCUD("Update"); 
            });

        });
    }

    function display_student_image(){
        var dt_force_reload = new Date();//way to force browser to reload picture after update of picture
        var imgPath = app.studentImagePath + studentHandled.details.student_id + ".jpg?" + dt_force_reload.getTime();
        common.setCanvas($("#canvasStudent")[0], imgPath, "regular");
    }

    function studentSelected(row)
    {
        var studentID = row.find("#student-id").text();
        var studentName = row.find("#student-name").text(); 
        var studentPhone = row.find("#student-phone").text();
        var studentEmail = row.find("#student-email").text();
        var studentCourses = row.find("#student-courses").text();
        var so = StudentObject();
        studentHandled.details = new so.Student(studentID, studentName, studentPhone, studentEmail, studentCourses)
        loadStudentView();
    }


    function loadStudentCUD(action) {
        $.ajax("templates/school/students/cud-student.html").done(function(data) {
            $("#cud-student-title").empty();
            $("#main-container").empty();
            $("#main-container").prepend(data);
            initValidations();
            btnSaveHandler(action);
            buildCourses_cbl(); //build checkboxlist of all courses
            if(action == "Update"){
                //place name and description of student being updated in input field
                $("#cud-student-title").html( "Update Student Number: " + studentHandled.details.student_id);
                $("#studentID").val(studentHandled.details.student_id);//set student_id in hidden field for update/delete
                $("#studentName").val(studentHandled.details.student_name);
                $("#studentPhone").val(studentHandled.details.student_phone); 
                $("#studentEmail").val(studentHandled.details.student_email); 

                //check course checkbox if student registered for specific course
                if (studentHandled.details.student_courses != "") {
                    var courses = studentHandled.details.student_courses.split(',');
                    for (let i = 0; i < courses.length; i++) {
                        document.getElementById(courses[i]).checked = true;
                    }
                }
                display_student_image();
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

    function initValidations() {
        validationsStudent.initValidator();
        var validation_messages = validationsStudent.formValidated.validator.settings.messages;
        validation_messages.student_name = "Student name required";
        validation_messages.student_phone = "Valid phone required";
        validation_messages.student_email = "Valid email required";
        validation_messages.student_image = "Valid extensions: jpg, jpeg, png or gif";
        validation_messages.duplicate_student = "Student with same name, phone & email already exists";
    }        

    function buildCourses_cbl() {
        var container = $("#cblistCourses");
        var id = 1;
        for (let i = 0; i < courses.courseArray.length; i++) {
            $("<input/>",
             { type: 'checkbox', id: 'cbCourse' + courses.courseArray[i].course_id, 
                                 value: courses.courseArray[i].course_name,
                                 name: 'cbCourse' + courses.courseArray[i].course_id }).appendTo(container);
            $("<span/>", { text: courses.courseArray[i].course_name }).appendTo(container);
            $("<br />").appendTo(container);
        }
    }

    function btnSaveHandler(action) {

        $(".btnSave").off().click(function() {
            var verb;
            var ajaxData = $("#frmCUD").serialize();

            if(this.id == "btnDelete"){ // don't perform validations in case of delete
                var confirmation = confirm('Are you sure you want to delete student number ' + studentHandled.details.student_id + "?");
                if (confirmation == true) {
                    verb = "Delete";
                    server_request.sendServerRequest(verb, ajaxData, afterSave);  
                    return false;
                }
            }   
            else {
                student_action.chosen = action;
                verb =  action == "Add" ? "Add" : "Update"; 
                if (validationsStudent.formValidated.contents.valid()){
                    server_request.sendServerRequest
                        (verb, ajaxData, afterSave, "studentImage", "student_image");  
                    return false;
                }
            }
        });
    }  

    function afterSave(serverResponse) {
        if (serverResponse.status == "error") {
            alert("Following error(s) occured in " + serverResponse.action + ":\n" + serverResponse.message);
            return;
        }
        if (serverResponse.message.search("following errors") != -1) { //display msg about failed image upload
            alert("Following message for " + serverResponse.action + ":\n" + serverResponse.message);
        }
        var action = serverResponse.action.split(" ", 1)[0]; //first word of server_response.action contains action performed
        if (action == "Delete") {
            school.loadSchoolMain();
            return
        }

        courses.showCourses();
        showStudents();

        var get_course_student_data = setInterval(test_completion, 500);
        function test_completion() {
            if (courses.courses_retrieved.status && students.students_retrieved.status) {
                displayAfterSave(serverResponse, action);
                clearInterval(get_course_student_data);
            }
        }

    }

    function displayAfterSave(server_response, action){
        let studentTemp = action == "Create" ? server_response.new_studentID  : studentHandled.details.student_id; 
        let student_to_display = $.grep(studentArray, function(e){ return e.student_id ==  studentTemp});
        var so = StudentObject();
        studentHandled.details = new so.Student(student_to_display[0].student_id, 
                                                student_to_display[0].student_name, 
                                                student_to_display[0].student_phone, 
                                                student_to_display[0].student_email, 
                                                student_to_display[0].student_courses);
        loadStudentView();
    }

    function showStudents(){
        var ajaxData = { ctrl: 'student' };
        students_retrieved.status = false;
        server_request.sendServerRequest("Select", ajaxData, buildStudentTable); 
        return false;
    }

    function buildStudentTable(serverData){
        if (serverData.status == "error") {
            alert("Error occured: " + serverData.message);
            return;
        }
        //build array of student objects with data returned from server
        var so = StudentObject();
        studentArray.length = 0; //clear data from previous calls to buildStudentTable
        for (let i = 0; i < serverData.length; i++) {
            studentArray.push(new so.Student(serverData[i].student_id, 
                                              serverData[i].student_name,
                                              serverData[i].student_phone, 
                                              serverData[i].student_email,
                                              serverData[i].student_courses 
                                            ));
        }  
        students_retrieved.status = true;
        $.ajax("templates/school/students/student-row.html").done(function(data) {
            $("#students").html("");
            $("#totalStudents").html("Total number of Students: " + studentArray.length);
            //after loading students table row template append data from 1 student object to each row
            for(let i=0; i < studentArray.length; i++) {
                let template = data;
                //student data displayed in school aside
                template = template.replace("{{student_id}}", studentArray[i].student_id);
                template = template.replace("{{student_name}}", studentArray[i].student_name);
                template = template.replace("{{student_phone}}", studentArray[i].student_phone);
                //student data used to create student object
                template = template.replace("{{student-id}}", studentArray[i].student_id);
                template = template.replace("{{student-name}}", studentArray[i].student_name);
                template = template.replace("{{student-phone}}", studentArray[i].student_phone);
                template = template.replace("{{student-email}}", studentArray[i].student_email);
                template = template.replace("{{student-courses}}", studentArray[i].student_courses);
                $("#students").append(template);
            }
            common.loadCanvasList($("#students canvas"), app.studentImagePath, "school_aside");
        });
    }    

    return {

        loadStudentCUD: loadStudentCUD,  //function: used by school.js
        showStudents: showStudents,  //function: used by school.js/courses.js
        studentSelected: studentSelected, //fucntion: used by school.js
        studentArray : studentArray, //data: used by courses.js to build list of students in view-course.html
        students_retrieved: students_retrieved, //data: flag used to signal to course.js that building studentArray has completed after course update 
        studentHandled: studentHandled, //data: student data used by validationsStudent.js 
        student_action: student_action //data: data used by validationsStudent.js ->  need to know if update or insert
    }

})();


