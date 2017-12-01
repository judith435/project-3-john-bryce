var studentObject = function() {
    
            function Student(stdntID, stdntName, stdntPH, stdntE, stdntCRS) {
                this.student_id = stdntID;
                this.student_name = stdntName;
                this.student_phone = stdntPH;
                this.student_email = stdntE;
                this.student_courses = stdntCRS;
            }
        
    return {
            Student: Student
           }; 
    };