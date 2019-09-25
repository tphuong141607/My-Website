var express 	= require('express'),
	app 		= express(),
	bodyParser  = require('body-parser'),
	mongoose 	= require('mongoose');


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// ROOT Route
app.get('/', function(req, res){
	res.render('landing');
});

// About Me Page Route
app.get('/aboutMe', function(req, res){
	res.render('aboutMe');
});

// Contact PAge Route
app.get('/contact', function(req, res){
	res.render('contact');
});

// Tell Express to listen for requests (start server)
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myApp Server has started!');
});


