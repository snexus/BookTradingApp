var mongoose = require('mongoose');
var BookModel = mongoose.model("Books");
var BooksUsersModel = mongoose.model("BooksUsers");
var UserInfoModel = mongoose.model("UserInfo");
var MessageModel = mongoose.model("Messages")

module.exports = {
    addBook: function(user,  title, thumbLink, authors, callback) {
                  var book = new BookModel({owner:user, title: title, requestedBy:"", thumbLink:thumbLink, authors:authors});
                  book.save(function(err){
                      if (err) return callback(err)
                      sendMessage(user,"App","Book "+book.title+" was added to collection.", function(err){return callback(err)})
                     
              })
      
    },
    
    getUserBooks: function(user, callback) {
        BookModel.find({owner: user}, function(err, books) {
            if (err) return callback(err)
            BooksUsersModel.find({user:user}, function(err, bookUser){
                if (err) return callback(err);
                console.log("inside getUserBook, bookUser = ", bookUser)
                findBookArrayById(bookUser[0].requests, function(err, requestBooks){
                   
                    if (err) return callback(err);
                   //  console.log("inside getUserBook, requestBooks = ", requestBooks)
                        findBookArrayById(bookUser[0].approvals, function(err, approvalBooks){
                            // console.log("inside getUserBook, approvalsBooks = ", approvalBooks)
                        if (err) return callback(err); 
                        MessageModel.findOne({user:user}, function(err, userMessages){
                            if (err) return callback(err); 
                            var messages = [{from:"App",message:"Welcome to book trading"}]
                           // console.log("userMessages = ", userMessages, userMessages.messages )
                            if ((userMessages!=null) && (userMessages.messages!=undefined)) messages=userMessages.messages
                             return callback(err, {allBooks:books, requests:requestBooks, approvals:approvalBooks, messages:messages});
                        })
                        
                        });
                });

            })
        
        });
    },
    

    newUser: function(username, callback)
    {
        createNewBookUser(username, function(err, bookUser){
            if (err) {return callback(err) }
                var newMessageUser = new MessageModel({user:username, messages: [{from:"App",message:"Welcome to book trading"}]});
                  newMessageUser.save(function(err){
                     if (err) {return callback(err) }
                     var newUserInfo = new UserInfoModel({user:username, name:"",city:"",state:""});
                     newUserInfo.save(function(err){
                          return callback(err,bookUser)});
                     })
                    
                     });
            
            
    },
    
    getUserInfo: function(username, callback)
    {
        UserInfoModel.findOne({user:username}, function(err, userInfo){
            if (err) return callback(err);
            if (!userInfo)
            {
                var newUserInfo = new UserInfoModel({user:username, name:"",city:"",state:""});
                newUserInfo.save(function(err){
                    return callback(err,{name:"", city:"", state:""})});
                     }
            else {
            return callback(err, {name:userInfo.name, city:userInfo.city, state:userInfo.state})}
        });
    },

    updateUserInfo: function(username, name, city, state, callback)
    {
      UserInfoModel.findOne({user:username}, function(err, userInfo){
          
          if (err) return callback(err);
          userInfo.name = name;
          userInfo.city = city;
          userInfo.state = state;
          userInfo.save(function(err){
            return callback(err)  ;
          }
          );
      });
    },
    
    
    deleteBook: function(username, id, callback) {
           BookModel.findById(id, function(err, book) {
                if (err) {return callback(err) }
            book.remove( function(err){
                  if (err) {return callback(err) }
                sendMessage(username,"App","Book "+book.title+" was deleted.", function(err){return callback(err)})

            });
        });
    },
    
    requestBook: function(username, id, callback)
    {
        createUpdateBookUser(username, id, "requests", function(err)
        {
          if (err) {return callback(err) }
          BookModel.findById(id, function(err, book) {
              if (err) {return callback(err) }
                  var updateObj = {}
                    updateObj['requestedBy'] = username;
                    book.update({$set:updateObj}, function(err, updated){
                                        if (err) {return callback(err) }
                                         console.log("updated book requestedBY, updated = ",updated)
                                          var approvingUser = book.owner;
                                          createUpdateBookUser(approvingUser, id, "approvals", function(err){
                                               if (err) {return callback(err) }
                                                 sendMessage(approvingUser, "App","User "+username+" requsted '"+book.title+"'.", function(err){  return callback(err);})
                                             
                                             
                                          })
                 });

          });
        })
        
    },
    
    removeRequest: function(username, id, msg, callback)
    {
       BookModel.findById(id, function(err, book) {
           if (err) {return callback(err) }
           console.log("inside remove request, book = ", book)
           var requestingUser = book.requestedBy
           console.log("remove request, requesting user = ", requestingUser)
            var approvingUser = book.owner;
            var updateObj = {}
            updateObj['requestedBy'] = "";
             book.update({$set:updateObj}, function(err, updated){
                   if (err) {return callback(err) }
                BooksUsersModel.findOne({user:approvingUser}, function(err, approvingUser) {
                 if (err) {return callback(err) }
                deleteFrom(approvingUser,id,'approvals', function(err){
                     if (err) {return callback(err) }
                if (requestingUser!=""){
                    BooksUsersModel.findOne({user:requestingUser}, function(err, requestingBookUser) {
                         if (err) {return callback(err) }
                   
                         deleteFrom(requestingBookUser,id,'requests', function(err){
                              sendMessage(requestingUser, "App","Request for '"+book.title+"' was "+msg, function(err){  return callback(err);})
                             
                         });
                    });}
                else return callback(err);
                    
                });
                
            });
                 
             });

       }); 
        
    },
    
    
    
    getAllBooks: function(callback) {
    BookModel.find({}, function(err, docs) {
        return callback(err,docs);
        });
    },
    
    
  
}



   function sendMessage(user, from, message, callback)
    {
            MessageModel.findOne({user:user}, function(err, messageUser) {
        if (err) {return callback(err) }
        if (!messageUser)
        {
             var newMessageUser = new MessageModel({user:user, messages: []});
                  newMessageUser.save(function(err){
                     if (err) {return callback(err) }
                     updateMessage(newMessageUser, from, message, function(err){return callback(err)});
                     });
        }
        else updateMessage(messageUser, from, message, function(err){return callback(err)})
        
    })
    }


function  createUpdateBookUser(username, addWhat, addWhere, nextFunction) {
           BooksUsersModel.findOne({user:username}, function(err, bookUser) {
                if (err) {return nextFunction(err) }
                if (!bookUser)
                {
                   createNewBookUser(username, function(err, newBookUser){
                     if (err) {return nextFunction(err) }
                        console.log("success: createNewBookUser->createNewBookUser, usename = ", username)
                        addTo(newBookUser,  addWhat, addWhere, nextFunction)
                   });
                }
                else
                {
                    addTo(bookUser, addWhat, addWhere, nextFunction)
                }
        });
    }
    



function createNewBookUser(userId, callback)
{
   var newBookUser = new BooksUsersModel({user:userId, requests:[], approvals:[]});
                    newBookUser.save(function(err){
                        if (err) {return callback(err) }
                        return callback(null, newBookUser); 
                    });
}

function addTo(bookUser, addWhat, addWhere, nextFunction)
{
    var array = bookUser[addWhere]
    console.log("inside addTo, bookUser, addwhere, array (addwhere) = ", bookUser,addWhere, array)
    if (array.indexOf(addWhat) ==-1) {array.push(addWhat)}
    else
    {console.log("inside addTo, array already contains value ", addWhat)}
    console.log("inside addTo, after push, array (addwhere) = ", array)
    var updateObj = {}
    updateObj[addWhere] = array;
    bookUser.update({$set:updateObj}, function(err, updated){
                               console.log("inside addTo, updated = ",updated)
               return nextFunction(err) 
 });
    
}

function deleteFrom(bookUser, deleteWhat, deleteWhere, nextFunction)
{
    console.log("inside deleteFrom, bookUser,  deleteWhat, deleteWhere array = ", bookUser,deleteWhat, deleteWhere, array)
    var array = bookUser[deleteWhere]
    var index = array.indexOf(deleteWhat) 
    if ( index>-1) { array.splice(index, 1);}
      else return nextFunction(null) 
    // {console.log("inside addTo, coudln't find value ")}
    console.log("inside addTo, after push, array (addwhere) = ", array)
    var updateObj = {}
    updateObj[deleteWhere] = array;
    bookUser.update({$set:updateObj}, function(err, updated){
                               console.log("inside deleteFrom, updated = ",updated)
               return nextFunction(err) 
 });
    
}



function findBookArrayById(bookArray, callback)
{
BookModel.find({
    '_id': { $in: bookArray}}, function(err, docs){
         return callback(err, docs)
});
}

function updateMessage(messageUser, from, message, callback)
{
    var array = messageUser.messages
    console.log("messageUser messages ", array)
    if (array.length>3) array.splice(0, array.length-3);
    array.push({from:from, message:message})
    var updateObj = {}
    updateObj['messages'] = array;
    console.log("messageUser messages after update ", array)
    messageUser.update({$set:updateObj}, function(err, updated){
                               console.log("inside udpateMessage, updated = ",updated)
               return callback(err) 
 });
    
}