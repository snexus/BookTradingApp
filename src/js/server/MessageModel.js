// define the User model schema
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  user: String, 
  messages: [mongoose.Schema.Types.Mixed],
});


mongoose.model("Messages", MessageSchema);