// define the User model schema
var mongoose = require('mongoose');

var BookUserSchema = new mongoose.Schema({
  user: String, 
  requests: [mongoose.Schema.Types.ObjectId],
  approvals: [mongoose.Schema.Types.ObjectId],
});


mongoose.model("BooksUsers", BookUserSchema);