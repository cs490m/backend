var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer')


var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/sensors", { native_parser:true });

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//configuration =========================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//set up email notification
var transport = nodemailer.createTransport('SMTP', { // [1]
  service: "Gmail",
  auth: {
    user: "cse490m2@gmail.com",
    pass: "cse490m2backend" // NOTE let's move these to a seperate file...
  }
})

//routes ================================================================
app.use('/', routes);
app.use('/api', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//error handlers==========================================================

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// this will send us emails when the system crashes.
process.on('uncaughtException', function (er) {
    console.error(er.stack)
    transport.sendMail({
      from: 'alerts@mycompany.com',
      to: 'alert@mycompany.com',
      subject: er.message,
      text: er.stack
    }, function (er) {
       if (er) console.error(er)
       process.exit(1)
    })
})

module.exports = app;