'use strict'

var courses = (function() {

    var course_action = {}; //data used by validationsCourse.js ->  need to know if update or insert
    var courseHandled = {}; //course data also used by validationsCourse.js 
    var courseArray = [];
    var courses_retrieved = {}; //flag used by student.js which needs to know if all courses have been retrieved

    function loadCourseView() {

        $.ajax('templates/school/courses/view-course.html').done(function(data) {
            $("#main-container").empty();
            $('#main-container').prepend(data);
            var studentNumbers = courseHandled.details.number_of_students_for_course == 0 ? "no" :  courseHandled.details.number_of_students_for_course ;
            var courseText = courseHandled.details.course_name + ", " + studentNumbers + " students";
            $('#courseName').html(courseText);
            $('#CourseDescription').html(courseHandled.details.course_description); 

            if (courseHandled.details.student_ids != "") {// student_ids == "" - no students found for course being handled
                var studentHtml = "";
                var studentIDs = courseHandled.details.student_ids.split(',');
                for (let i = 0; i < studentIDs.length; i++) {
                        let student = $.grep(students.studentArray, function(e){ return e.student_id ==  studentIDs[i]});
                        studentHtml += '<div class="info-row-minor">';
                        studentHtml += '<canvas  data-canvas-id="' + studentIDs[i] + '" class="img-fluid info-minor" width="40" height="50" ></canvas>';
                        studentHtml += '<div class="info-container">';
                        studentHtml += '<label class="text-left">' + student[0].student_name + '</label>';
                        studentHtml += '</div>';
                        studentHtml += '</div>';
                }
                $('#studentList').append(studentHtml);
                //load images for all canvas elements created
                common.loadCanvasList($('#studentList canvas'), app.studentImagePath, "small");
            }

            //get admin data to check if admin role is sales => may not update course data
            var data = sessionStorage.getItem('administrator');
            if (sessionStorage.getItem('administrator') === null) {//admin session object not found MUST immediately log in agaןn 
                login_logout.login();
                return;
            }
            var admin = JSON.parse(data);
            if (admin.role_name == "sales") { //administrator type sales is not entitled to update course => hide edit button 
                $("#btnEdit").hide();
            }
            display_course_image();
            $("#btnEdit").off().click(function() {
                loadCourseCUD("Update"); 
            });

        });
    }
    
    function courseSelected(row)  {
        var courseID = row.find('#course-id').text();
        var courseName = row.find('#course-name').text(); 
        var courseDescr= row.find('#course-description').text();
        var studentCourse = row.find('#number-of-students-for-course').text();
        var studentIDs = row.find('#student-ids').text();
        var co = CourseObject();
        courseHandled.details = new co.Course(courseID, courseName, courseDescr, studentCourse, studentIDs)
        loadCourseView();
    }

    function loadCourseCUD(action) {
        $.ajax('templates/school/courses/cud-course.html').done(function(data) {
            $("#cud-course-title").empty();
            $("#main-container").empty();
            $('#main-container').prepend(data);
            initValidations();
            btnSaveHandler(action);
            if(action == "Update"){
                //place name and description of course being updated in input field
                $('#cud-course-title').html( "Update Course Number: " + courseHandled.details.course_id);
                $('#courseID').val(courseHandled.details.course_id);//set course_id in hidden field for update/delete
                $('#courseName').val(courseHandled.details.course_name);
                $('#courseDescription').val(courseHandled.details.course_description); 
                if (courseHandled.details.number_of_students_for_course > 0){ //course has been assigned to students cannot be deleted
                    $('#btnDelete').hide(); 
                }
                display_course_image();
                $('#studentTotal').html("Total " + courseHandled.details.number_of_students_for_course + " students taking this course");
            }
            else {//create
                    $("#cud-course-title").html(action + ' Course');
                    $('#btnDelete').hide(); 
                    $('#cbDeleteImage').hide(); 
                }

            $("#courseImage").change(function() {
                common.uploadImage($('#canvasCourse')[0], this);
            });

            $("#btnCancel").off().click(function() {
                common.clearImage($('#canvasCourse')[0], $('#courseImage')[0]);
            });
        });
    }

    function display_course_image(){
        var dt_force_reload = new Date();//way to force browser to reload picture after update of picture
        var imgPath = app.courseImagePath + courseHandled.details.course_id + ".jpg?" + dt_force_reload.getTime();
        common.setCanvas($('#canvasCourse')[0], imgPath, "regular");
    }

    function initValidations() {
        validationsCourse.initValidator();
        var validation_messages = validationsCourse.formValidated.validator.settings.messages;
        validation_messages.course_name = "Course name required";
        validation_messages.course_description = "Course description required";
        validation_messages.course_image = "Valid extensions: jpg, jpeg, png or gif";
        validation_messages.duplicate_course = "Course with same name already exists";
    }        

    function btnSaveHandler(action) {

        $(".btnSave").off().click(function() {
            var verb;
            var ajaxData = $('#frmCUD').serialize();

            if(this.id == "btnDelete"){ // don't perform validations in case of delete
                var confirmation = confirm('Are you sure you want to delete course number ' + courseHandled.details.course_id + "?");
                if (confirmation == true) {
                    verb = "Delete";
                    server_request.sendServerRequest(verb, ajaxData, afterSave);  
                    return false;
                }
            }   
            else {
                course_action.chosen = action;
                verb =  action == "Add" ? "Add" : "Update"; 
                if (validationsCourse.formValidated.contents.valid()){
                    server_request.sendServerRequest(verb, ajaxData, afterSave, "courseImage", "course_image");  
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

        //after each update must update both course and student date (student data also uses course data)
        showCourses();
        students.showStudents();
        //displayAfterSave must only run after both course and student has been retrieved 
        var get_course_student_data = setInterval(test_completion, 500);
        function test_completion() {
            if (courses.courses_retrieved.status && students.students_retrieved.status) {
                displayAfterSave(serverResponse, action);
                clearInterval(get_course_student_data);
            }
        }
    }

    function displayAfterSave(server_response, action){
        let courseTemp = action == "Create" ? server_response.new_courseID  : courseHandled.details.course_id; 
        let course_to_display = $.grep(courseArray, function(e){ return e.course_id ==  courseTemp});
        let co = CourseObject();
        //update courseHandled with updated course data
        courseHandled.details = new co.Course(  course_to_display[0].course_id, 
                                                course_to_display[0].course_name, 
                                                course_to_display[0].course_description, 
                                                course_to_display[0].number_of_students_for_course, 
                                                course_to_display[0].student_ids);
        loadCourseView();
    }

    function showCourses(){
        var ajaxData = { ctrl: 'course' };
        courses_retrieved.status = false;
        server_request.sendServerRequest("Select", ajaxData, buildCourseTable); 
        return false;
    }

    function buildCourseTable(serverData){
        if (serverData.status == "error") {
            alert("Error occured: " + serverData.message);
            return;
        }
        //build array of course objects with data returned from server
        var co = CourseObject();
        courseArray.length = 0; //clear data from previous calls to buildCourseTable
        for (let i = 0; i < serverData.length; i++) {
            courseArray.push(new co.Course(serverData[i].course_id, 
                                           serverData[i].course_name,
                                           serverData[i].course_description, 
                                           serverData[i].number_of_students_for_course, 
                                           serverData[i].student_ids
                                        ));
        } 

        courses_retrieved.status = true;

        $.ajax('templates/school/courses/course-row.html').done(function(data) {
            $("#courses").html("");
            $('#totalCourses').html("Total number of Courses: " + courseArray.length);
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
                $('#courses').append(template);
            }
            common.loadCanvasList($('#courses canvas'), app.courseImagePath, "school_aside");
        });
    }


    return {

        loadCourseCUD: loadCourseCUD, //function:  used by school.js
        showCourses: showCourses, //function: used by school.js/students.js
        courseSelected: courseSelected, //fucntion: used by school.js
        courseArray : courseArray, //data: used by students.js to build course checkboxlist
        courses_retrieved: courses_retrieved, //data: flag used to signal to student.js that building courseArray has completed after student update 
        courseHandled : courseHandled, //data: course data used by validationsCourse.js 
        course_action: course_action //data: data used by validationsCourse.js ->  need to know if update or insert
        
    }

})();


