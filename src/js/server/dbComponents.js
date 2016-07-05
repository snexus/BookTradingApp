var mongoose = require('mongoose');
var BookModel = mongoose.model("Books");

module.exports = {
    addBook: function(user,  title, thumbLink, authors, callback) {
                  var book = new BookModel({owner:user, title: title, thumbLink:thumbLink, authors:authors});
                  book.save(function(err){
                      return callback(err);
              })
      
    },
    
    getUserBooks: function(user, callback) {
        BookModel.find({owner: user}, function(err, docs) {
        return callback(err,docs)
        });
    },
    
    deleteBook: function(username, id, callback) {
           BookModel.findById(id, function(err, book) {
                if (err) {return callback(err) }
            book.remove( function(err){
               return callback(err) ;
            });
        });
    },
    
    getAllBooks: function(callback) {
    BookModel.find({}, function(err, docs) {
        return callback(err,docs);
        });
    },
    
  
}