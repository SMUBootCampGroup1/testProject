var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var SearchSchema = new Schema({
  distance: Number,
  keyword: String,
  latitude: String,
  longitude: String,
  userId: String
},
{
  timestamps: true
});

// This creates our model from the above schema, using mongoose's model method
var Search = mongoose.model("Search", SearchSchema);

// Export the Note model
module.exports = Search;
