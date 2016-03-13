var express = require('express');
var path = require('path');

var app = express();
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var port = 8000;
app.listen(port, function() {
  console.log("Node app is running at http://localhost:" + port);
});


