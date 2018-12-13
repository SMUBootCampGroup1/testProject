var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var ResultSchema = new Schema({
  city: String,
  cuisines: Array,
  googlePhotos: Array,
  googlePlaceId: String,
  googleRating: Number,
  latitude: Number,
  longitude: Number,
  name: String,
  priceLevel: Number,
  priceTwo: Number,
  saved: { type: Boolean, default: 0 },
  searchId: String,
  street: String,
  types: Array,
  website: String,
  zip: String,
  zomatoMenu: String,
  zomatoPhotos: String,
  zomatoRating: Number
},
{
  timestamps: true
});

// This creates our model from the above schema, using mongoose's model method
var Result = mongoose.model("Result", ResultSchema);

// Export the Note model
module.exports = Result;
