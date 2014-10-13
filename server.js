/**
 * Created by jcm1317 on 10/6/14.
 */

//set up  ===============================================================
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var router = express.Router();


var morgan = require('morgan');

//configuration =========================================================
app.use(morgan('dev')); // for logging requests to the console

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// error handling
app.use(function(err, req, res, next) {
    //do logging and user-friendly error message display
    res.send(500);
})
app.use("/public", express.static(__dirname + '/public'));

app.set('view engine', 'ejs'); // set up ejs for templating

//routes ================================================================
var router = express.Router(); 				// get an instance of the express Router

require('./app/routes.js')(app, router);


//launch ================================================================

app.use(express.static('/var/www/html'));

app.listen(port);
console.log('Running on port ' + port);
