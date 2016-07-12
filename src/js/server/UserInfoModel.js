// define the User model schema
var mongoose = require('mongoose');

var UserInfoSchema = new mongoose.Schema({
  user: String, 
  name: String,
  city: String,
  state: String,
});


mongoose.model("UserInfo", UserInfoSchema);