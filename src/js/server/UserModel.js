// define the User model schema
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
  login: { type: String, index: { unique: true }}, //unique in the collection
  password: String,
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

UserSchema.pre('save', function(next) {
  var user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();


  bcrypt.genSalt(function (err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) { return next(err); }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});
mongoose.model("Users", UserSchema);