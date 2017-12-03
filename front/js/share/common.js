"use strict";

var common = (function() {

      var canvasSize = {
            regular: [80, 100],   
            small: [40, 50],
            adminAside: [48, 60],
            schoolAside: [33, 42]   
      };
        
      function setCanvas(canvas, imgPath, size) {
            var context = canvas.getContext("2d");
            var imageObj = new Image();
            imageObj.onload = function() {
                  context.drawImage(imageObj, 0, 0, canvasSize[size][0], canvasSize[size][1]);
            };
            imageObj.src = imgPath;
      }

      function clearImage(canvas, inputFile) {
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            inputFile.value = inputFile.defaultValue;
      }

      function uploadImage(canvas, input) {
            if (input.files && input.files[0] ) {
                  var fileRDR  = new FileReader();
                  fileRDR .onload = function(e) {
                        var context = canvas.getContext("2d");
                        var img = new Image();
                        img.addEventListener("load", function() {
                              context.drawImage(img, 0, 0, 80, 100); //for uploads canvas size is fixed
                        });
                        img.src = e.target.result;
                  };       
                  fileRDR .readAsDataURL(input.files[0]);
            }
      }
      
      function loadCanvasList(canvasList, imagePath, size) {
            for (let i = 0; i < canvasList.length; i++) {
                  let canvas = canvasList[i];
                  var dtForceReload = new Date();//way to force browser to reload picture after update of picture
                  var imgPath = imagePath + $(canvas).data("canvas-id") + ".jpg?" + dtForceReload.getTime();
                  common.setCanvas(canvas, imgPath, size);
            }
      }


      function afterCourseStudentSave(serverResponse) {
            if (serverResponse.status === "error") {
                alert("Following error(s) occured in " + serverResponse.action + ":\n" + serverResponse.message);
                return;
            }
            if (serverResponse.message.search("following errors") !== -1) { //display msg about failed image upload
                alert("Following message for " + serverResponse.action + ":\n" + serverResponse.message);
            }
            var action = serverResponse.action.split(" "); 
            var actionVerb = action[0]; //first word of serverResponse.action contains action performed
            var actionEntity = action[1]; //second word of serverResponse.action contains entity: course/student
            if (action === "Delete") {
                school.loadSchoolMain();
                return;
            }
    
            //after each update must update both course and student date (student data also uses course data)
            courses.showCourses();
            students.showStudents();
            //displayAfterSave must only run after both course and student has been retrieved 
            var getCourseStudentData;
            function testCompletion() {
                  if (courses.coursesRetrieved.status && students.studentsRetrieved.status) {
                        if (actionEntity === "course"){
                              courseSave.displayAfterSave(serverResponse, action);
                        } 
                        else {
                              studentSave.displayAfterSave(serverResponse, action);
                        } 
                        clearInterval(getCourseStudentData);
                  }
            }
            getCourseStudentData = setInterval(testCompletion, 500);
        }
    

  return {
            setCanvas : setCanvas,
            clearImage: clearImage, 
            uploadImage : uploadImage,
            loadCanvasList : loadCanvasList,
            afterCourseStudentSave: afterCourseStudentSave
      };


}());
