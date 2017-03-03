/**
 * Created by Robert on 2/8/2017.
 */
const mongoose = require('mongoose');

// let Schema = mongoose.schema;

//Create a Schema
let locationSchema = mongoose.Schema({
  _id: {type: String}, //same as name
  name: {type: String, required: true, unique: true, trim: true},
  picturePath: String,
  roles: [String]
});

// Make _id from name on save if _id doesn't exist
locationSchema.post('validate', (doc) => {
  if(!doc._id) doc._id = doc.name;

});

let Location = mongoose.model('Location', locationSchema);

module.exports = Location;