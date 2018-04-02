const admin = require('firebase-admin'); // helps access firebase features
var device = require('./device');

// import credentials for app
var serviceAccount = require('./aida-61389-firebase-adminsdk-am0xv-b70cd2cbab.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore(); // get firestore instance

device.onButtonClick();

// get list of devices and listen for changes, get() returns a Promise of data's snapshot
db.collection('home_devices').get()
.then((snapshot) => {
   // for each document, add a onChange listener
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        doc.ref.onSnapshot((sh) => device.onDeviceChanged(sh));
    });
})
.catch((err) => {
    console.log('Error getting documents', err);
});