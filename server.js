var express = require('express');
var path = require('path');
var FlightAware = require('flightaware.js');

// Get access to the FlightAware 2.0 client API ...
// See http://flightaware.com/commercial/flightxml for username/apiKey ...
var username = 'your-flightaware-username';
var apiKey = 'your-flightaware-apiKey';
var client = new FlightAware(username, apiKey);

var app = express();
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/Arrived/:airport', function(req, res) {
    client.Arrived({
        airport: req.params.airport, 
    }, function(err, result) { 
        if (err) return res.send(err);
        res.json(result);
    });
});

var port = 8000;
app.listen(port, function() {
  console.log("Node app is running at http://localhost:" + port);
});


