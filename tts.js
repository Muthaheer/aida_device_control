var googleTTS = require('google-tts-api');
var player = require('play-sound')(opts = {});
const fs = require('fs');
var https = require('https')

exports.say = function(text){
    player.play();
    var file = fs.createWriteStream("file.mp3");
    googleTTS(text, 'en', 1)   // speed normal = 1 (default), slow = 0.24
        .then(function (url) {
            var request = https.get(url, function(response) {
               var stream = response.pipe(file);
               stream.on('finish', function(){
                    playSound()
               });
              });
           })
        .catch(function (err) {
         console.log(err.stack);
        });
};



function playSound(){
    console.log('Speaking');
    var audio = player.play('file.mp3', function(err){
        if (err) throw err
      });
      //console.log(audio)
}