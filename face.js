
var NodeWebcam = require('node-webcam');
var request = require('request-json');

var client = request.createClient('https://0c41d6a2.ngrok.io/');

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
   
      callbackReturn: "location",  
      //Logging 
      verbose: false
   
    };
   
   
  //Creates webcam instance 
   
  var Webcam = NodeWebcam.create( opts );
   
   
  //Will automatically append location output type 
   
  Webcam.capture( "test_picture", function( err, data ) {} );
   
   
  //Also available for quick use 
   
  NodeWebcam.capture( "test_picture", opts, function( err, data ) {
   
  });
   
   
  //Get list of cameras 
   
  Webcam.list( function( list ) {
   
      //Use another device 
   
      var anotherCam = NodeWebcam.create( { device: list[ 0 ] } );
   
  });
   
  //Return type with base 64 image 
   
  var opts = {
      callbackReturn: "base64"
  };
   
  NodeWebcam.capture( "test_picture", opts, function( err, data ) {
      var image = "<img src='" + data + "'>";
      var imageData = data.split(',');
      var encodedImage = {
           imageData : imageData[1]
      }
      recogniseImage(encodedImage)
  });
};

function recogniseImage(encodedImage){
    console.log(encodedImage)
    
    client.post('face-recognition', encodedImage, function(err, res, body) {
        console.log(body);
      });
}
