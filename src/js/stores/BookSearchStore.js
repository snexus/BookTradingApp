import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import * as auth from "../auth/clientAuth.js";


class BookSearchStore extends EventEmitter {
    constructor() {
        super();
        this.booksFound = {};
        this.userBooks = {};
        this.allBooks = {};
        this.statusMsg = "";
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
    getAllBooksFromServer()
        {
        this.allBooks = {};  
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
                
            default:
                return true;
        }

    }

};

const bookSearchStore = new BookSearchStore;
dispatcher.register(bookSearchStore.handleActions.bind(bookSearchStore));
export default bookSearchStore;
