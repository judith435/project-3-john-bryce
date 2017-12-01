var courseObject = function() {
    
            function Course(crsID, crsName, crsDesc, stdntCRS, stdntIDs) {
                this.course_id = crsID;
                this.course_name = crsName;
                this.course_description = crsDesc;
                this.number_of_students_for_course = stdntCRS;
                this.student_ids = stdntIDs;
            }
        
    return {
            Course: Course
           }; 
    };