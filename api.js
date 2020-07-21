var express = require('express');
var app = express();
var fs = require("fs");

app.get('/', (req, res) => {
  console.log(req);
  res.json({
    "test": 1
  })
})

var server = app.listen(4000, () => {
  var host = server.address().address
  var port = server.address().port
});
