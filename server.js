/**
 * Created by jcm1317 on 10/6/14.
 */

//set up  ===============================================================
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var morgan = require('morgan');

//configuration =========================================================
app.use(morgan('dev')); // for logging requests to the console

app.set('view engine', 'ejs'); // set up ejs for templating

//routes ================================================================
require('./app/routes.js')(app);


//launch ================================================================

app.use(express.static(__dirname + '/views'));

app.listen(port);
console.log('Running on port ' + port);
