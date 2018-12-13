require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
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

//html routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/search_history.html", function(req, res) {
  res.sendFile(path.join(__dirname, "./search_history.html"));
});

//api routes
app.get("/api/searchhistory/:user", function(req, res){
  var userId = req.params.user;
  var historyObject = [];

  db.Search.find({userId: userId}).sort({createdAt: -1})
  .then(function (results) { 
      for(let i=0; i<results.length; i++){
        var headerId = results[i]._id;
        var idToSearch = String(headerId);
        var headerDate = results[i].createdAt;
        var headerKeyword = results[i].keyword;
        
        db.Result.find({searchId: idToSearch}).sort({createdAt: -1})
        .then(function(resultsMatching){
          var relatedResults = [];
          relatedResults.push(resultsMatching);
          var historyRow = {
            date: headerDate,
            keyword: headerKeyword,
            relatedResults: relatedResults
          };
          historyObject.push(historyRow);

          if(i==(results.length-1)){
            res.json(historyObject);
          }
        })
        .catch(function(err){
          var historyRow = {
            date: headerDate,
            keyword: headerKeyword,
            relatedResults: []
          };
          historyObject.push(historyRow);
          
          if(i==(results.length-1)){
            res.json(historyObject);
          }
          console.log(err);
        });
      }//end for i loop

  })
  .catch(function(err){
    console.log(err);
  });
});//end app.get searchhistory/user

app.post("/api/places", function(req, res) {
  var searchResultPlaces = req.body; 
  
    db.Result.create(searchResultPlaces)
    .then(function (newDoc) {
      res.json(newDoc);
    })
    .catch(function (err) {
      res.json(err);
    });

});//end app.POST places

app.post("/api/searches", function(req, res) {
  let newRecord = req.body;
  db.Search.create(newRecord)
  .then( function(result){
    res.send(result);
  });//close db.Search.create.then
}); 

app.put("/api/places/:id", function(req, res) { 
  let dbResultsId = req.params.id;
  let updateBody = req.body;
  
  db.Result.findOneAndUpdate(
    { '_id': dbResultsId },
    { $set: updateBody },
    { new: true }
  )
  .then(function (newDoc) {
    res.json(newDoc);
  })
  .catch(function (err) {
    res.json(err);
  });//end result.findoneandupdate

});//end put places

app.get("https://truvanow.herokuapp.com/googlebaeb2747edb6a20f.html", 
function(req, res) {
  res.sendFile(path.join(__dirname, "https://truvanow.herokuapp.com/public/googlebaeb2747edb6a20f.html"));
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
