"use strict";

var common = (function() {

      var canvas_size = {
            regular: [80, 100],   
            small: [40, 50],
            admin_aside: [48, 60],
            school_aside: [33, 42]   
      }
        
      function setCanvas(canvas, imgPath, size) {
            var context = canvas.getContext("2d");
            var imageObj = new Image();
            imageObj.onload = function() {
                  context.drawImage(imageObj, 0, 0, canvas_size[size][0], canvas_size[size][1]);
            };
            imageObj.src = imgPath;
      }

      function clearImage(canvas, input_file) {
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            input_file.value = input_file.defaultValue;
      }

      function uploadImage(canvas, input) {
            if (input.files && input.files[0] ) {
                  var file_reader = new FileReader();
                  file_reader.onload = function(e) {
                        var context = canvas.getContext("2d");
                        var img = new Image();
                        img.addEventListener("load", function() {
                              context.drawImage(img, 0, 0, 80, 100); //for uploads canvas size is fixed
                        });
                        img.src = e.target.result;
                  };       
                  file_reader.readAsDataURL(input.files[0]);
            }
      }
      
      function loadCanvasList(canvas_list, imagePath, size) {
            for (let i = 0; i < canvas_list.length; i++) {
                  let canvas = canvas_list[i];
                  var dt_force_reload = new Date();//way to force browser to reload picture after update of picture
                  var imgPath = imagePath + $(canvas).data("canvas-id") + ".jpg?" + dt_force_reload.getTime();
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
