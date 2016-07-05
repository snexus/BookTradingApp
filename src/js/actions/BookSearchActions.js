import dispatcher from "../dispatcher";


    export function findBook(book){
        dispatcher.dispatch({
           type:"BOOKSEARCH_FINDBOOK",
           book: book,
        });
    }
    
    export function addBook(book){
        dispatcher.dispatch({
           type:"BOOK_ADDBOOK",
           book: book,
        });
    }
    
    export function deleteBook(id){
        dispatcher.dispatch({
           type:"BOOK_DELETEBOOK",
           id: id,
        });
    }



