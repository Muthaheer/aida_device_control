var Gpio = require('onoff').Gpio; // for managing gpio pins
var face = require('./face');

// listener for device state changed
exports.onDeviceChanged = function(device) {
    // get an instance of LED with device's pin
    var LED =  new Gpio(device.get('device_pin'), 'out')
    if(device.get('is_on')== true)
        LED.writeSync(1)
    else
        LED.writeSync(0)
    console.log(device.id,device.data());
};

exports.onButtonClick = function(){
  var door = new Gpio(22, 'out'); //use GPIO pin 4 as output
  var pushButton = new Gpio(4, 'in', 'rising'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
  
  pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
    return;
    }
    console.log('button pressed');
    face.clickImage();
    //door.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
  });
  
  function unexportOnClose() { //function to run when exiting program
    door.writeSync(0); // Turn LED off
    door.unexport(); // Unexport LED GPIO to free resources
    pushButton.unexport(); // Unexport Button GPIO to free resources
  };
  
  process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c
};

