# angular-flightaware.js - AngularJS/flightaware.js example

## Installation

### Get the sources
```shell
git clone https://github.com/icedawn/angular-flightaware.js
```

### Download the dependencies
```shell
cd angular-flightaware.js
npm install
```

### Create config.js with your FlightAware 2.0 API credentials
```shell
cat > config.js << EOF
module.exports = {
    username : 'your-flightaware-username',
    apiKey :   'your-flightaware-api-key'
};
EOF
```

### Run the server
```shell
npm start
```

## Test the application

In your browser, load http://localhost:8000

You should see something like this ...
![AngularJS/flightaware.js example screenshot](/screenshots/arrival-screenshot.png?raw=true "AngularJS/flightaware.js example screenshot")

## Review the example code

There are three main files that make up this example:
* `server.js` - The main application server written for node.js, using Express.
* `index.html` - The main application view written using AngularJS and Bootstrap.
* `config.js` - Your FlightAware 2.0 API credentials you created as described above.

### server.js

```javascript
var express = require('express');
var path = require('path');
var FlightAware = require('flightaware.js');
var config = require('./config');

// Get access to the FlightAware 2.0 client API ...
// See http://flightaware.com/commercial/flightxml for username/apiKey ...
var client = new FlightAware(config.username, config.apiKey);

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
```

The first two lines include the Express framework and the node.js path handling module respectively.
```javascript
var express = require('express');
var path = require('path');
```

The next few lines setup your connection with the FlightAware 2.0 APIs via `flightaware.js`.  First the `flightaware.js` module is loaded, then the config file containing your FlightAware credentials, and finally the API `client` is instantiated.

```javascript
var FlightAware = require('flightaware.js');
var config = require('./config');

// Get access to the FlightAware 2.0 client API ...
// See http://flightaware.com/commercial/flightxml for username/apiKey ...
var client = new FlightAware(config.username, config.apiKey);
```

The next four lines create the Express application and map http://localhost:8000 to your main view, `index.html`.  This is just standard Express boilerplate.

```javascript
var app = express();
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
```

The next eight lines are the interesting bit.  This is a backend API that uses the FlightAware 2.0 API `Arrived`.  NOTE:  it is important for security reasons that your FlightAware credentials remain protected in this fashion.  You don't want to embed them in a web page that is downloaded to the user's browser where a hacker can see them.  

```javascript
app.get('/api/Arrived/:airport', function(req, res) {
    client.Arrived({
        airport: req.params.airport,
    }, function(err, result) {
        if (err) return res.send(err);
        res.json(result);
    });
});
```

This code uses Express to map `/api/Arrived/:airport` to the embedded function that calls `client.Arrived()` shown above.  Note that `:airport` is a variable parsed by Express routing, and it will appear in the code as `req.params.airport`.  For example, if the URI is /api/Arrived/SFO, then `:airport` matches "SFO", and subsequently `req.params.airport` will be equal to "SFO".  You can access this backend API, http://localhost:8000/api/Arrived/SFO.  

*Note you can access this backend API without compromising your FlightAware credentials.*

If your credentials have been setup correctly, you'll see some JSON when you hit this backend API.

![AngularJS/flightaware.js example backend API screenshot](/screenshots/backend-api-screenshot.png?raw=true "AngularJS/flightaware.js example backend API screenshot")

The remainder of `server.js` is the boilerplate to listen on port 8000 for web requests and route them through your app.

```javascript
var port = 8000;
app.listen(port, function() {
  console.log("Node app is running at http://localhost:" + port);
});
```

### index.html

The view, and its controller, are contained within the `index.html` file.  The main structure of the file is shown below.

```html
<!DOCTYPE html>
<html ng-app>
  <head>
    <title>AngularJS/flightaware.js example</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" >
  </head>
  <body>
    <section class="container">
      <!-- the view -->
    </section>

    <script type="text/javascript">
      // the controller
    </script>

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script>
  </body>
</html>
```

This is mostly boilerplate.  The `<html>` tag indicates this is an AngularJS application (https://angularjs.org).  The `<head>` section contains a link to Twitter's Bootstrap 3.0 user interface framework (http://getbootstrap.com).  The `<body>` tag contains the view and the controller for our application, along with a reference to the AngularJS framework.

The view section is shown below.  It has two main parts:  an input field so the user can specify the airport to query, and a table that contains the results from the FlightAware API call.  An AngularJS tutorial is beyond the scope of this document, but there are three important details to focus on:  
* the `<div>` tag at the top references the `FlightAwareController` via the `ng-controller` property which binds this section of code to the controller we'll discuss shortly.
* the `<input>` tag references the variable `destination` via the `ng-model` property.
* the table's `<tbody>` tag defines a prototype table row for each arrival record returned by the FlightAware 2.0 `Arrived` API via the `ng-repeat` property.

```html
<section class="container">
  <h2>FlightAware 2.0 Arrived API</h2>
  <div ng-controller="FlightAwareController">
    <label>Airport</label>
    <input type="text" ng-model="destination" placeholder="e.g. KBOI"/>
    <table class="table table-bordered table-striped table-hover">
      <thead>
        <tr>
          <th>Arrival</th> <th>Flight</th> <th>Origin</th> <th>Destination</th> <th>Departure</th> <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="arrival in arrivals.arrivals | orderBy:'-actualarrivaltime'">
          <td valign='top'>
            {{arrival.actualarrivaltime*1000 | date:'yyyy-MM-dd HH:mm:ss Z'}}
          </td>
          <td valign='top'>
            {{arrival.ident}}<br/>
            <small>{{arrival.origin}} &#8594; {{arrival.destination}}</small>
          </td>
          <td valign='top'>
            {{arrival.originName}}<br/>
            <small>{{arrival.originCity}}</small>
          </td>
          <td valign='top'>
            {{arrival.destinationName}}<br/>
            <small>{{arrival.destinationCity}}</small>
          </td>
          <td valign='top'>
            {{arrival.actualdeparturetime*1000 | date:'yyyy-MM-dd HH:mm:ss Z'}}
          </td>
          <td valign='top'>
            {{ Duration(arrival) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
```

The following code is the `FlightAwareController` controller that you'll see following the view code above.  The first line defines the `FlightAwareController` controller function.

```html
<script type="text/javascript">
  FlightAwareController = function($scope, $http) {

    // Setup page defaults ...
    $scope.destination = 'SFO';
    $scope.arrivals = {};

    // Create a function to call FlightAware 2.0 API "Arrived" ...
    $scope.Arrived = function() {
      $http.get('/api/Arrived/' + $scope.destination)
      .success(function (data) {
        $scope.arrivals = data;
      })
      .error(function (error) {
        $scope.arrivals = 'Error retrieving route details: ' + error;
      });
    };

    // Call the Arrived() API and post the results to $scope.arrivals ...
    $scope.Arrived();

    // When the user updates the destination, reload the arrival information ...
    $scope.$watch('destination', function(newValue, oldValue) {
        if($scope.destination.length >= 3) {
            $scope.Arrived();
        }
    });

    // Compute the duration of a flight ...
    $scope.Duration = function(arrival) {
      var duration = arrival.actualarrivaltime - arrival.actualdeparturetime;
      var hours = Math.floor(duration / 3600);
      var seconds = Math.floor((duration % 3600)/60);
      return hours + ":" + ((seconds < 10) ? '0' :'') + seconds;
    }

  };
</script>
```

The second two lines setup two variables for the view section to use:
* `$scope.destination` - variable that will be bound to the input field in the view (we preload this with "SFO")
* `$scope.arrivals` - variable that will contain the results of the FlightAware `Arrived` API call and will be to fill in the table in the view

```javascript
// Setup page defaults ...
$scope.destination = 'SFO';
$scope.arrivals = {};
```

The next ten lines of code create a wrapper function which call our backend `Arrived` API that we setup in `server.js` as described in the previous section.

```javascript
// Create a function to call FlightAware 2.0 API "Arrived" ...
$scope.Arrived = function() {
  $http.get('/api/Arrived/' + $scope.destination)
  .success(function (data) {
    $scope.arrivals = data;
  })
  .error(function (error) {
    $scope.arrivals = 'Error retrieving route details: ' + error;
  });
};
```

The AngularJS `$http` object is used to make an asynchronous HTTP request to `/api/Arrived/:airport`, where `:airport` is the string contained in `$scope.destination`.  Since this method is asynchoronous, two other functions are defined, `.success` and `.error`, which will be called upon a successful HTTP request or some error condition respectively.  Upon success, the `$scope.arrivals` variable will contain the response from our backend `Arrived` API call; otherwise, `$scope.arrivals` will contain an error string.  *Note:  error handling needs to be improved here.*

The next two lines of code are used to initially call our backend `Arrived` API when the page is first loaded.  Specifically, this calls the asynchronous function, `Arrived` we just defined above.

```javascript
// Call the Arrived() API and post the results to $scope.arrivals ...
$scope.Arrived();
```

The next few lines of code are what make this page interactive as the user updates the Airport input field.

```javascript
// When the user updates the destination, reload the arrival information ...
$scope.$watch('destination', function(newValue, oldValue) {
    if($scope.destination.length >= 3) {
        $scope.Arrived();
    }
});
```

This AngularJS code sets up a `$watch` on the variable `$scope.destination`, and the given function, which calls `$scope.Arrived()`, is called every time the user changes the Airport input field in the browser to a new value with at least three characters.

The last six lines of code define a convenience function, `Duration()`.  

```javascript
// Compute the duration of a flight ...
$scope.Duration = function(arrival) {
  var duration = arrival.actualarrivaltime - arrival.actualdeparturetime;
  var hours = Math.floor(duration / 3600);
  var seconds = Math.floor((duration % 3600)/60);
  return hours + ":" + ((seconds < 10) ? '0' :'') + seconds;
}
```

This is here as UI candy, but it also shows how you can create functions in the controller to help with the presentation of the view.  

### config.js

This file contains your FlightAware username and secret API key.  You want to protect this file from public web access which is why we hide its usage behind a backend API.

```javascript
module.exports = {
    username : 'your-flightaware-username',
    apiKey :   'your-flightaware-api-key'
};
```

There's nothing magical about this file.  You could embed these values in other backend config file, or even the `server.js` file.  For the sake of this example, it's easier to have the credentials in their own file which is ignored by git via the `.gitignore` file.
