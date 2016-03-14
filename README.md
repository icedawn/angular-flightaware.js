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
