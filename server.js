var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 8080;
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("./public"));

require("./routes/controller")(app);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/truva";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
