var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");

var db = require("./db.js").db;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));

const apiKey = "193553c5-3358-4cb6-a2bb-3c99fedb4f77";

app.post('/sql/get', (req, res) => {
  if (req.headers["x-api-key"] !== apiKey) res.status(403).json({
    "message": "Invalid API key!"
  });
  else {
    db.get(req.body["sql"], req.body['sql-paramaters'], (err, result) => {
      if (err) {
        console.log("Error retrieving sql data: " + err.message);
        res.status(500).json({
          "message": err.message
        })
      }
      else {
        res.status(200).json(result);
      }
    });
  }
});

app.post('/sql/all', (req, res) => {
  if (req.headers["x-api-key"] !== apiKey) res.status(403).json({
    "message": "Invalid API key!"
  });
  else {
    db.all(req.body["sql"], req.body['sql-paramaters'], (err, result) => {
      if (err) {
        console.log("Error retrieving sql data: " + err.message);
        res.status(500).json({
          "message": err.message
        })
      }
      else {
        res.status(200).json(result);
      }
    });
  }
});

app.post('/sql/run', (req, res) => {
  if (req.headers["x-api-key"] !== apiKey) res.status(403).json({
    "message": "Invalid API key!"
  });
  else {
    db.run(req.body["sql"], req.body['sql-paramaters'], err => {
      if (err) {
        console.log("Error retrieving sql data: " + err.message);
        res.status(500).json({
          "message": err.message
        })
      }
      else res.status(200);
    });
  }
});

var server = app.listen(4000, () => {
  var host = server.address().address
  var port = server.address().port
});
