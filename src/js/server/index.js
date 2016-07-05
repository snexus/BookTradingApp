
var path = process.cwd();

var serverAuth = require(path + '/src/js/auth/serverAuth.js');
var db = require(path + '/src/js/server/dbComponents.js');


module.exports = function (app) { 
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
				res.status(200).json({error:false, message:"Signup successfull"});	
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
		
		app.route("/allbooks").get(function (req, res) {


					db.getAllBooks(function(err, books)
					{
					if (err) 
							{
								console.log(err);
								res.status(400).json({message:"Get all books unsuccessful"});
							}
					else {
						console.log("Sending all books to client, ", books);
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
							
						res.status(200).json({message:"Delete successful"});
					}
				
						});
						
					}
			});
	});
		

};

