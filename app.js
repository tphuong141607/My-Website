var express 	= require('express'),
	app 		= express(),
	methodOverride = require('method-override'), 
	bodyParser  = require('body-parser'),
	passport 	= require('passport'),
	LocalStrategy = require('passport-local'),
	Project 	= require('./models/project'),
	User 		= require('./models/user'),
	mongoose 	= require('mongoose'); 

//------------------------//
// Mongoose/Model Config  //
//------------------------//
mongoose.connect('mongodb://localhost/myWeb_project', {useNewUrlParser: true , useUnifiedTopology: true}); 


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

//-----------------------//
// Passport Config       //
//-----------------------//
app.use(require('express-session')({
		secret:'I have the best parents in the world!',
		resave: false,
		saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//-----------------------------//
// REGULAR ROUTES (front-end)  //
//-----------------------------//

// ROOT Page Route
app.get('/', function(req, res){
	res.render('landing');
});

// aboutMe Page Route
app.get('/aboutMe', function(req, res){
	res.render('aboutMe');
});

// Contact Page Route
app.get('/contact', function(req, res){
	res.render('contact');
});

//-----------------------------//
// RESTFUL ROUTES for PROJECTs //
//-----------------------------//
// INDEX route (show all prrojects)
app.get('/projects', function(req, res){
	Project.find({}, function(err, allProjects){
		if(err) {
			console.log("Error!");
		} else {
			res.render('projects/index', {projects:allProjects, currentUser:req.user});
		}
	});	
});

// NEW route (input form)
app.get('/projects/new', isLoggedIn, function(req, res){
	res.render('projects/new');
});

// CREATE route (add the new project into our db)
app.post('/projects', isLoggedIn, function(req, res){
	// Create project
	Project.create(req.body.project, function(err, newProject){
		if(err){
			res.render('new');
		} else {
			res.redirect('/projects');
		}
	})
});

// SHOW route (show the detail info of a specific project)
app.get('/projects/:id', function(req, res){
	Project.findById(req.params.id, function(err, foundProject){
		if(err) {
			res.redirect('/projects');
		} else {
			res.render('projects/show', {project:foundProject});
		}
	});
});

// EDIT route (input form)
app.get('/projects/:id/edit', isLoggedIn, function(req, res){
	Project.findById(req.params.id, function(err, foundProject){
		if(err) {
			res.redirect('/projects');
		} else{
			res.render('projects/edit', {project:foundProject});
		}
	})
});

// UPDATE route (update the edited input into our db)
app.put('/projects/:id', isLoggedIn, function(req, res){
	Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updateProject){
		if(err){
			res.redirect('/projects');
		} else {
			res.redirect('/projects/' + req.params.id);
		}
	});
});

// DELETE route (remove data from the db)
app.delete('/projects/:id', isLoggedIn, function(req, res){
	Project.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/projects');
		} else {
			res.redirect('/projects');
		}
	});
});

//--------------//
// AUTH ROUTES  //
//--------------//

// ---------- REGISTER
// Show the register form
app.get('/register', function(req, res){
	res.render('register');
});

// handle sign up logic 
app.post('/register', function(req, res){
	if (req.body.verification == 'SteamyBun1407'){
		var newUser = new User({username: req.body.username});
		User.register(newUser, req.body.password, function (err, newlyCreatedUser) {
			if(err) {
				console.log(err);
				return res.render('register');
			}
			// strategy: local
			passport.authenticate('local')(req, res, function(){
				res.redirect('/projects');
			})
		});
	} else {
		console.log('incorrect verification code');
		return res.render('register');
	}
});

// ---------- LOG-IN
// Show the login form
app.get('/login', function(req, res){
	res.render('login');
});

// handle login logic 
// app.post('/route', middleware, callback)
app.post('/login', passport.authenticate('local', 
	{
		successRedirect:'/projects',
		failureRedirect:'/login',
	}), function(req, res){
});


// ---------- LOGOUT
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/projects');
});

// Middleware function
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}


// Tell Express to listen for requests (start server)
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myApp Server has started!');
});







