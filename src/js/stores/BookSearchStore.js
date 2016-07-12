import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import * as auth from "../auth/clientAuth.js";


class BookSearchStore extends EventEmitter {
    constructor() {
        super();
        this.booksFound = {};
        this.userBooks = {allBooks:[], requests:[], approvals:[]};
        this.allBooks = [];
        this.statusMsg = "";
        this.userInfo="";
    }

    getFoundBooks(){
        return this.booksFound;
    }
    
    getAllBooks()
    {
        return this.allBooks
    }
    
    addBook(book) {
        const {title, thumbLink, authors} = book;
        var xhr = new XMLHttpRequest();
        var token = auth.getToken();
        var bookRecord = 'title=' + encodeURIComponent(title)+'&thumbLink=' + encodeURIComponent(thumbLink)+'&authors=' + encodeURIComponent(authors)+'&token='+encodeURIComponent(token);
        xhr.open('post', '/add');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
        xhr.responseType = 'json';
        xhr.onload = function() {
          
         if (xhr.status == 200) {
             this.updateBookListFromServer();
          } else {
            this.updateBookListFromServer();
            console.log("addBook failed, possible server error");
          }
          
       }.bind(this);
      xhr.send(bookRecord);
    }
    
    deleteBook(id)
    {
         var xhr = new XMLHttpRequest();
         var token = auth.getToken();
        var user = 'id=' + encodeURIComponent(id) +"&token="+encodeURIComponent(token);
        xhr.open('post', '/delete');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
        xhr.responseType = 'json';
        xhr.onload = function() {
          
         if (xhr.status == 200) {
            this.updateBookListFromServer();
          } else {
            
            this.updateBookListFromServer();
            console.log("deleteBook failed, possible server error");
          }
          
       }.bind(this);
      xhr.send(user);
    }
    
    requestBook(id)
    {
        var xhr = new XMLHttpRequest();
        var token = auth.getToken();
        var user = 'id=' + encodeURIComponent(id) +"&token="+encodeURIComponent(token);
        xhr.open('post', '/request');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
        xhr.responseType = 'json';
        xhr.onload = function() {
          
         if (xhr.status == 200) {
            this.updateBookListFromServer();
          } else {
            
        //    this.updateBookListFromServer();
            console.log("requestBook failed, possible server error");
          }
          
       }.bind(this);
      xhr.send(user);
    }
    
    removeBookRequest(id, msg)
    {
        var xhr = new XMLHttpRequest();
        var token = auth.getToken();
        var user = 'id=' + encodeURIComponent(id) +"&token="+encodeURIComponent(token) +"&msg="+encodeURIComponent(msg);
        xhr.open('post', '/request/remove');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
        xhr.responseType = 'json';
        xhr.onload = function() {
          
         if (xhr.status == 200) {
            this.updateBookListFromServer();
          } else {
            
        //    this.updateBookListFromServer();
            console.log("cancelRequest failed, possible server error");
          }
          
       }.bind(this);
      xhr.send(user);  
    }
    
    updateBookListFromServer()
        {
        this.booksFound = {};
        var xhr = new XMLHttpRequest();
        var token = auth.getToken();
        xhr.open('GET', encodeURI('userbooks/'+token));
        xhr.onload = function() {
            if (xhr.status === 200) {
            this.userBooks = JSON.parse(xhr.responseText);
                console.log("BookStore: Got user books, ", this.userBooks)
                this.emit("change");
            }
            else {
                console.log("getUserBooks failed, possible server error");
                this.userBooks = {};
                this.emit("change");
          }

        }.bind(this);
        xhr.send();
          
        }
    
    updateUserInfo(name, city,state){
        var xhr = new XMLHttpRequest();
        var token = auth.getToken();
        var user = 'name=' + encodeURIComponent(name)+'&city='+ encodeURIComponent(city)+'&state=' +encodeURIComponent(state)+"&token="+encodeURIComponent(token);
        xhr.open('post', '/updateinfo');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
        xhr.responseType = 'json';
        xhr.onload = function() {
          
         if (xhr.status == 200) {
             this.emit("change");
          } else {

            console.log("updateUserInfo failed, possible server error");
          }
          
       }.bind(this);
      xhr.send(user);
    }
    
    getUserInfoFromServer()
        {
        this.booksFound = {};
        var xhr = new XMLHttpRequest();
        var token = auth.getToken();
        xhr.open('GET', encodeURI('userinfo/'+token));
        xhr.onload = function() {
            if (xhr.status === 200) {
            this.userInfo = JSON.parse(xhr.responseText);
                console.log("BookStore: Got user info, ", this.userInfo)
                this.emit("change");
            }
            else {
                console.log("getUserInfo failed, possible server error");
                this.userInfo = {name:"",city:"",state:""};
                this.emit("change");
          }

        }.bind(this);
        xhr.send();
          
        }
        
    getAllBooksFromServer()
        {
        // this.allBooks = {};  
        var xhr = new XMLHttpRequest();

        xhr.open('GET', encodeURI('/allbooks'));
        xhr.onload = function() {
            if (xhr.status === 200) {
            this.allBooks = JSON.parse(xhr.responseText);
                console.log("BookStore: got all books ", this.allBooks)
                this.emit("change");
            }
            else {
                console.log("getUserBooks failed, possible server error");
                this.allBooks = {};
                this.emit("change");
          }

        }.bind(this);
        xhr.send();
          
        }

  
    getUserBooks()
    {
        return this.userBooks;
    }
    
    getUserInfo()
    {
        return this.userInfo;
    }
    
    findBook(book) {
        this.booksFound = {};
        var xhr = new XMLHttpRequest();
        xhr.open('GET', encodeURI('https://www.googleapis.com/books/v1/volumes?q=' + book));
        xhr.onload = function() {
            if (xhr.status === 200) {

                this.booksFound = JSON.parse(xhr.responseText);
                console.log("books found = ", this.booksFound);
                this.emit("change");
            }
            else {
                this.statusMsg = xhr.status;
            }
        }.bind(this);
        xhr.send();

    }

    handleActions(action) {
        switch (action.type) {

            // Respond to RECEIVE_DATA action
            case "BOOKSEARCH_FINDBOOK":
                this.findBook(action.book);
                break;
            
             case "BOOK_ADDBOOK":
                this.addBook(action.book);
                break;
            
            case "BOOK_DELETEBOOK":
                this.deleteBook(action.id);
                break;
            
            case "BOOK_REQUESTBOOK":
                this.requestBook(action.id);
                break;
            
            case "BOOK_CANCELREQUEST":
                this.removeBookRequest(action.id,"removed");
                break;
            case "BOOK_APPROVEREQUEST":
                this.removeBookRequest(action.id,"approved");
                break;
            case "BOOK_DECLINEREQUEST":
                this.removeBookRequest(action.id,"declined");
                break;
            case "USER_UPDATEUSERINFO":
                this.updateUserInfo(action.name, action.city, action.state);
                break;
                
            default:
                return true;
        }

    }

};

const bookSearchStore = new BookSearchStore;
dispatcher.register(bookSearchStore.handleActions.bind(bookSearchStore));
export default bookSearchStore;
