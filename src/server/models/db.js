/**
 * Created by Robert on 2/8/2017.
 */

const mongoose = require('mongoose');


//Connect to Db
let dbURI = 'mongodb://user:spyng@ds145669.mlab.com:45669/spyng_locations_roles';

/*MongoClient.connect(dbURI, (err, database) => {
 if (err) throw err;
 console.log("Connected to Database Server");
 db = database;
 setRoutes();
 launchBackend();
 });*/

mongoose.connect(dbURI);
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through server termination');
    process.exit(0);
  });
});

// Bring in Schemas and Models
require('./location');