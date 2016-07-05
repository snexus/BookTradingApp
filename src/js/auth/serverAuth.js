var mongoose = require('mongoose');


var jwt = require('jsonwebtoken');
var jwtSecret = "myVotingAppSecret8812351"



// define the User model schema
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  login: { type: String, index: { unique: true }}, //unique in the collection
  password: String,
});



var UserModel = mongoose.model("Users");
module.exports = {
    saveUser: function(login,pass,callback) {
      console.log("inside saveUser: login, pass = ", login, pass)
                  var user = new UserModel({login:login, password:pass});
                  user.save(function(err){
                      return callback(err);
              })
      
    },
    
   processLogin: function(login, pass, callback) 
   {
   //  console.log("inside processLogin, login, pass = ", login, pass)
     UserModel.findOne({login:login}, function(err, user){
       if (err) {return callback(err);}
      if (!user) {
        var error = new Error("Incorrect email or password");
        error.name = "IncorrectCredentialsError";
        return callback(error);
      }
       user.comparePassword(pass, function(err, isMatch){
         if (err) return callback(err);
         if (!isMatch)
         {
           var error = new Error("Incorrect email or password")
           error.name = "IncorrectCredentialsError";
           return callback(error)
         }
         var payload = 
         {
           sub: user._id,
         }
         var token = jwt.sign(payload, jwtSecret)
         return callback(null,token,"Login succesfull")
       })
       
     })
   },
   getUser: function(token,callback)
   {
       jwt.verify(token, jwtSecret, function(err, decoded) {
     
              if (err) { return callback(err); }
        
              var userId = decoded.sub;
        
              // check if a user exists
              UserModel.findById(userId, function(err, user) {
                if (err || !user) {
                  return callback(err);
                }
        
                return callback(null,user);
        
              });
           
       });
      
   }
   
}