require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 8080;
var db = require("./models");
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("./public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/truva";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", function(req, res) {
  db.User.find({}).
  then(function(data){
    console.log(data);
    res.sendFile(path.join(__dirname, "index.html"));
  });
});

app.get("https://truvanow.herokuapp.com/googlebaeb2747edb6a20f.html", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/googlebaeb2747edb6a20f.html"));
});

app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
