
var NodeWebcam = require('node-webcam');
var request = require('request-json');
var tts = require('./tts');
var say = require('say')
var client = request.createClient('http://192.168.1.115:8000/');

exports.clickImage = function(){
    //Default options 

    var opts = {
   
      //Picture related  
      width: 500,  
      height: 500,  
      quality: 100,
      //Delay to take shot 
   
      delay: 0,
      //Save shots in memory 
      saveShots: true,
      // [jpeg, png] support varies 
      // Webcam.OutputTypes 
   
      output: "jpeg",
      //Which camera to use 
      //Use Webcam.list() for results 
      //false for default device 
   
      device: false, 
      // [location, buffer, base64] 
      // Webcam.CallbackReturnTypes 
      callbackReturn: "base64",
      //callbackReturn: base64,  
      //Logging 
      verbose: false
   
    };
   
   
  //Creates webcam instance 
   
  var Webcam = NodeWebcam.create( opts );
   
  Webcam.capture( "test_picture", function( err, data ) {
    var imageData = data.split(',');
    var encodedImage = {
         imageData : imageData[1]
    };
    
    recogniseImage(encodedImage);
  });
  
};

function recogniseImage(encodedImage){
    //console.log(encodedImage)
    
    client.post('face-recognition', encodedImage, function(err, res, body) {
        console.log(body.faces)
        if (body.faces.length > 0){
          console.log("Entered");
          tts.say(body.faces[0].name+' has arrived')
        } else {
          tts.say('You have an unknown visitor')
        }
      });
}
