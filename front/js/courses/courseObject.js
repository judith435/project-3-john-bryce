var CourseObject = function() {
    
            function Course(crs_id, crs_name, crs_desc, stdnt_crs, stdnt_ids) {
                this.course_id = crs_id;
                this.course_name = crs_name;
                this.course_description = crs_desc;
                this.number_of_students_for_course = stdnt_crs;
                this.student_ids = stdnt_ids;
            }
        
    return {
            Course: Course
           } 
    }
