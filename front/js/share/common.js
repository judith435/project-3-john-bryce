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


  return {
            setCanvas : setCanvas,
            clearImage: clearImage, 
            uploadImage : uploadImage,
            loadCanvasList : loadCanvasList
      };


})();
