// define the User model schema
var mongoose = require('mongoose');

var BookUserSchema = new mongoose.Schema({
  user: String, 
  requests: [String],
  approvals: [String],
});


mongoose.model("BooksUsers", BookUserSchema);