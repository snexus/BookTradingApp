'use strict';

var mongoose = require('mongoose');
var dbURI = process.env.MONGO_URI;
console.log("dbURI = ", dbURI)


require('./src/js/server/UserModel.js');
require('./src/js/server/BooksModel.js');
// require('./app/serverComponents/PollModel.js');

var Users = mongoose.model("Users");
var Books = mongoose.model("Books");
// var Polls = mongoose.model("Polls");
mongoose.connect(dbURI);

var express = require('express');
var routes = require('./src/js/server/index.js');
var path = require("path");
var bodyparser = require('body-parser')
var app = express();


app.use(bodyparser.urlencoded({extended: false}))
//console.log(process.cwd() + '/app/dist')
app.use('/resource', express.static(process.cwd() + '/src/resource'));
app.use(express.static(path.join(__dirname,"./src")));

routes(app);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});