var courseObject = function() {
    
            function Course(crsID, crsName, crsDesc, stdntCRS, stdntIDs) {
                this.courseID = crsID;
                this.courseName = crsName;
                this.courseDescription = crsDesc;
                this.number_of_students_for_course = stdntCRS;
                this.student_ids = stdntIDs;
            }
        
    return {
            Course: Course
           }; 
    };