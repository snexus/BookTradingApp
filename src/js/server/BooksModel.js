// define the User model schema
var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  owner: String, 
  title: String,
  authors: String,
  thumbLink: String,
});


mongoose.model("Books", BookSchema);