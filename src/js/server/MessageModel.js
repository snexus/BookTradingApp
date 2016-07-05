// define the User model schema
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  to: String, 
  from: String,
  date: Date,
});


mongoose.model("Messages", MessageSchema);