'use strict';

var mongoose = require('mongoose');
var dbURI = process.env.MONGO_URI;
console.log("dbURI = ", dbURI)


require('./src/js/server/UserModel.js');
require('./src/js/server/BooksModel.js');
require('./src/js/server/BookUsersModel.js');
require('./src/js/server/MessageModel.js');
require('./src/js/server/UserInfoModel.js');
// require('./app/serverComponents/PollModel.js');

var Users = mongoose.model("Users");
var Books = mongoose.model("Books");
var BooksUsers = mongoose.model("BooksUsers");
var UserInfo = mongoose.model("UserInfo");
var Messages = mongoose.model("Messages")
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



var port = process.env.PORT || 8080;
var server = app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

var io = require('socket.io').listen(server);

 
// Set socket.io listeners.
io.sockets.on('connection', function(socket)
   {
        console.log('a user connected');
     socket.on('disconnect',function(){  console.log('user disconnected'); });
   }
);
// io.on('connection', (socket) => {
//   console.log('a user connected');
 
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });
routes(app,io);
 
// Set Express routes.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});