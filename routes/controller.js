var express = require("express");
var router = express.Router();
var db = require("../models");

router.get("/", function(req, res) {
  db.User.find({}).
  then(function(data){
    console.log(data);
    res.sendFile(path.join(__dirname, "index.html"));
  });
});

// router.post("/api/burgers", function(req, res) {
//   db.insertOne([
//     "burgername"
//   ], [
//     req.body.burgername
//   ], function(result) {
//     // Send back the ID of the new quote
//     res.json({ id: result.insertId });
//   });
// });

// router.put("/api/burgers/:id", function(req, res) {
//   var condition = "id = " + req.params.id;   console.log("condition", condition);

//   burger.updateOne({
//     devoured: true
//   }, condition, function(result) {
//     if (result.changedRows == 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });

// Export routes for server.js to use.
module.exports = router;
