
var path = process.cwd();

var serverAuth = require(path + '/src/js/auth/serverAuth.js');
var db = require(path + '/src/js/server/dbComponents.js');


module.exports = function (app, io) { 
	app.route('/').get(function (req, res) {
	    console.log(path)
		res.sendFile(path + '../index.html');
		});
	
	// Login
		app.route("/auth/login").post(function (req, res) {

			serverAuth.processLogin(req.body.login.trim(), req.body.password.trim(), function(err,token,message)
			{
				if (err) 
				{
					console.log(err);
					res.status(400).json({message:"Bad login information"})
				}
				else
				{
						
					res.status(200).json({token:token,message:"Login successful"});
				}
			});
		});
	
	// Signup
		app.route("/auth/signup").post(function (req, res) {
			
			console.log("signup query = ", req.body);
			serverAuth.saveUser(req.body.login.trim(), req.body.password.trim(), function(err)
			{
			if (err	) 
			{
				console.log(err);
				res.status(400).json({error:false, message:"Signup couldn't complete"});	
			}	
			else {
				db.newUser(req.body.login.trim(), function(err, bookUser){
					if (err) res.status(400).json({error:false, message:"Signup couldn't complete"});
					res.status(200).json({error:false, message:"Signup successfull"});	
				})
				
				}
			});
		
	});
	
			app.route("/add").post(function (req, res) {
				//{title, thumbLink, authors
			var title = req.body.title.trim();
			var thumbLink = req.body.thumbLink.trim();
			var authors = req.body.authors.trim()
			var userToken = req.body.token.trim();
			console.log("add book on server: ",title, thumbLink, authors);
			serverAuth.getUser(userToken,function(err,user){
					if (err) 
				{
					console.log(err);
					res.status(400).json({message:"Bad user"})
				}
				else
				{
					db.addBook(user.login, title, thumbLink, authors, function(err)
					{
					if (err) 
							{
								console.log(err);
								res.status(400).json({message:"Add book unsuccessful"})
							}
					else
					{
						console.log("Server: add book successful");	
						io.emit('update',{})
						res.status(200).json({message:"Add book successful"});
					}
				
						});
					
					}
			});
	});
	
		app.route("/userbooks/:token").get(function (req, res) {
		var userToken = req.params.token.trim();
				serverAuth.getUser(userToken,function(err,user){
				if (err) res.status(400).json({message:"Bad user"});

				else
				{
					console.log("USer found = ",user)
					db.getUserBooks(user.login, function(err, books)
					{
					if (err) 
							{
								console.log(err);
								res.status(400).json({message:"Get user books unsuccessful"});
							}
					else {
						console.log("Sending user books to client, ", books)
						res.status(200).json(books);	}
				
						});
					
					}
				});
				
		});
		
		
		app.route("/userinfo/:token").get(function (req, res) {
		var userToken = req.params.token.trim();
				serverAuth.getUser(userToken,function(err,user){
				if (err) res.status(400).json({message:"Bad user"});

				else
				{
				
					db.getUserInfo(user.login, function(err, userInfo)
					{
					if (err) 
							{
								console.log(err);
								res.status(400).json({message:"Get user books unsuccessful"});
							}
					else {
						console.log("Sending user info to client, ", userInfo)
						res.status(200).json(userInfo);	}
				
						});
					
					}
				});
				
		});
		
		app.route("/allbooks").get(function (req, res) {


					db.getAllBooks(function(err, books)
					{
					if (err) 
							{
								console.log(err);
								res.status(400).json({message:"Get all books unsuccessful"});
							}
					else {
					//	console.log("Sending all books to client, ", books);
						res.status(200).json(books);	}
				
						});
					
					});
		
		

				

		
		
		app.route("/delete").post(function (req, res) {
			var id = req.body.id.trim();
			var userToken = req.body.token.trim();
			console.log("Delete poll on server (id, token): ",id, userToken);
			serverAuth.getUser(userToken,function(err,user){
					if (err) 
				{
					console.log(err);
					res.status(400).json({message:"Bad user"});
				}
				else
				{
					db.deleteBook(user.login, id, function(err)
					{
					if (err) 
							{
								console.log(err);
								res.status(400).json({message:"Delete unsuccessful"});
							}
					else
					{
						io.emit('update',{})	
						res.status(200).json({message:"Delete successful"});
					}
				
						});
						
					}
			});
	});
	
			app.route("/request").post(function (req, res) {
			var id = req.body.id.trim();
			var userToken = req.body.token.trim();
			console.log("Request poll on server (id, token): ",id, userToken);
			serverAuth.getUser(userToken,function(err,user){
					if (err) 
				{
					console.log(err);
					res.status(400).json({message:"Bad user"});
				}
				else
				{
					db.requestBook(user.login, id, function(err)
					{
					if (err) 
							{
								console.log(err);
								res.status(400).json({message:"Request unsuccessful"});
							}
					else
					{
							io.emit('update',{})	
						res.status(200).json({message:"Request successful"});
					}
				
						});
						
					}
			});
	});
	
		app.route("/updatepassw").post(function (req, res) {
			var newPass = req.body.passw.trim();
			var userToken = req.body.token.trim();
			console.log("Update password on server (pass, token): ",newPass, userToken);
			serverAuth.getUser(userToken,function(err,user){
					if (err) 
				{
					console.log(err);
					res.status(400).json({message:"Bad user"});
				}
				else
				{
					serverAuth.updatePassword(user.login, newPass, function(err)
					{
					if (err) 
							{
								console.log(err);
								res.status(400).json({message:"Update unsuccessful"});
							}
					else
					{
						res.status(200).json({message:"Update successful"});
					}
				
						});
						
					}
			});
	});
	
			app.route("/updateinfo").post(function (req, res) {
			var name = req.body.name.trim();
			var city = req.body.city.trim();
			var state = req.body.state.trim();
			var userToken = req.body.token.trim();
			console.log("Update userinfo on server (name, city, state): ",name, city, state);
			serverAuth.getUser(userToken,function(err,user){
					if (err) 
				{
					console.log(err);
					res.status(400).json({message:"Bad user"});
				}
				else
				{
					db.updateUserInfo(user.login, name, city, state, function(err)
					{
					if (err) 
							{
								console.log(err);
								res.status(400).json({message:"Update unsuccessful"});
							}
					else
					{
						res.status(200).json({message:"Update successful"});
					}
				
						});
						
					}
			});
	});
	
	
	
			app.route("/request/remove").post(function (req, res) {
			console.log("req body = ",req.body)
			var id = req.body.id.trim();
			var userToken = req.body.token.trim();
			var msg = req.body.msg.trim();
			console.log("Request poll on server (id, token): ",id, userToken);
			serverAuth.getUser(userToken,function(err,user){
					if (err) 
				{
					console.log(err);
					res.status(400).json({message:"Bad user"});
				}
				else
				{
					db.removeRequest(user.login, id, msg, function(err)
					{
					if (err) 
							{
								console.log(err);
								res.status(400).json({message:"Cancel request unsuccessful"});
							}
					else
					{
						io.emit('update',{})
						res.status(200).json({message:"Cancel request successful"});
						
					}
				
						});
						
					}
			});
	});

		

};

