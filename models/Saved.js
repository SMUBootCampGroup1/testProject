var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var SavedSchema = new Schema({
  name: String,
  link: String,
  street: String,
  city: String,
  state: String,
  zip: String
});

// This creates our model from the above schema, using mongoose's model method
var Saved = mongoose.model("Saved", SavedSchema);

// Export the Note model
module.exports = Saved;