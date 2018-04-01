const admin = require('firebase-admin'); // helps access firebase features
var Gpio = require('onoff').Gpio; // for managing gpio pins
var NodeWebcam = require('node-webcam');
var request = require('request-json');


var client = request.createClient('http://localhost:5000/');


// import credentials for app
var serviceAccount = require('./aida-61389-firebase-adminsdk-am0xv-b70cd2cbab.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore(); // get firestore instance

// get list of devices and listen for changes, get() returns a Promise of data's snapshot
db.collection('devices').get()
.then((snapshot) => {
   // for each document, add a onChange listener
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        doc.ref.onSnapshot((sh) => onDeviceChanged(sh));
    });
})
.catch((err) => {
    console.log('Error getting documents', err);
});

// listener for device state changed
function onDeviceChanged(device) {
    // get an instance of LED with device's pin
    var LED =  new Gpio(device.get('device_pin'), 'out')
    if(device.get('is_on')== true)
        LED.writeSync(1)
    else
        LED.writeSync(0)
    console.log(device.id,device.data());
}


var door = new Gpio(18, 'out'); //use GPIO pin 4 as output
var pushButton = new Gpio(4, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  clickImage();
  door.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
 
});


function clickImage(){
     //Default options 
 
    var opts = {
    
       //Picture related  
       width: 300,  
       height: 300,  
       quality: 10,
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
       var encodedImage = {
            'imageUri' : data
       }
       recogniseImage(encodedImage)
       
   });
}

function recogniseImage(encodedImage){
    console.log('sent request')
    client.post('posts/', encodedImage, function(err, res, body) {
        console.log(err);
      });
}


function unexportOnClose() { //function to run when exiting program
  door.writeSync(0); // Turn LED off
  door.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c