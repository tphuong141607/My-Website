var express 	= require('express'),
	app 		= express(),
	methodOverride = require('method-override'), 
	bodyParser  = require('body-parser'),
	mongoose 	= require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

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

//------------------------//
// Mongoose/Model Config  //
//------------------------//
mongoose.connect('mongodb://localhost/myWeb_project', {useNewUrlParser: true , useUnifiedTopology: true}); 
var projectSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	toolUsed: String,
	github: String,
	dateCreated: {type: Date, default: Date.now}
});

var Project = mongoose.model('Project', projectSchema);



//-----------------------------//
// RESTFUL ROUTES for PROJECTs //
//-----------------------------//

// INDEX route (show all prrojects)
app.get('/projects', function(req, res){
	Project.find({}, function(err, projects){
		if(err) {
			console.log("Error!");
		} else {
			res.render('projects/index', {projects:projects});
		}
	});	
});

// NEW route (input form)
app.get('/projects/new', function(req, res){
	res.render('projects/new');
});

// CREATE route (add the new project into our db)
app.post('/projects', function(req, res){
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
app.get('/projects/:id/edit', function(req, res){
	Project.findById(req.params.id, function(err, foundProject){
		if(err) {
			res.redirect('/projects');
		} else{
			res.render('projects/edit', {project:foundProject});
		}
	})
});

// UPDATE route (update the edited input into our db)
app.put('/projects/:id', function(req, res){
	Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updateProject){
		if(err){
			res.redirect('/projects');
		} else {
			res.redirect('/projects/' + req.params.id);
		}
	});
});

// DELETE route (remove data from the db)
app.delete('/projects/:id', function(req, res){
	Project.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/projects');
		} else {
			res.redirect('/projects');
		}
	});
});


// Tell Express to listen for requests (start server)
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myApp Server has started!');
});







