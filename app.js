var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var session = require('express-session');
var flash = require('connect-flash');
var methodOverride = require('method-override');

var routes = require('./routes/index');
var users = require('./routes/users');
var companies = require('./routes/companies');
var segments = require('./routes/segments');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'secret', resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));

//Used for flash messages
app.use(flash());
app.use(function(req, res, next) {
  res.locals.message = req.flash();
  next();
});

//Extracts PUT from a POST
app.use(methodOverride(function(req, res) {
	  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
	    // look in urlencoded POST bodies and delete it
	    var method = req.body._method
	    delete req.body._method
	    return method
	  }
}));

//Define the routes here
app.use('/', routes);
app.use('/users', users);
app.use('/companies', companies);
app.use('/segments', segments);



//Connect to the backend DB

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
		replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

var mongodbUri = 'mongodb://dbuser:dbuser@ds047642.mongolab.com:47642/test';
var mongooseUri = uriUtil.formatMongoose(mongodbUri); 

mongoose.connect(mongooseUri, options);
var conn = mongoose.connection; 

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
// Wait for the database connection to establish, then start the app.
	console.log("MONGOOSE CONNECTED");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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

//start the server
const PORT=8081; 
app.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

module.exports = app;
