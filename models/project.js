var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	toolUsed: String,
	github: String,
	dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Project', projectSchema);