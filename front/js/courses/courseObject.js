var courseObject = function() {
    
            function Course(crsID, crsName, crsDesc, stdntCRS, stdntIDs) {
                this.courseID = crsID;
                this.courseName = crsName;
                this.courseDescription = crsDesc;
                this.numberOfStudentsForCourse = stdntCRS;
                this.studentIDs = stdntIDs;
            }
        
    return {
            Course
           }; 
    };