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
    
    export function requestBook(id){
        dispatcher.dispatch({
           type:"BOOK_REQUESTBOOK",
           id: id,
        });
    }
    
    export function approveBookRequest(id){
        dispatcher.dispatch({
           type:"BOOK_APPROVEREQUEST",
           id: id,
        });
    }
    
    export function cancelBookRequest(id){
        dispatcher.dispatch({
           type:"BOOK_CANCELREQUEST",
           id: id,
        });
    }
    
    export function declineBookRequest(id){
        dispatcher.dispatch({
           type:"BOOK_DECLINEREQUEST",
           id: id,
        });
    }
    
    export function updateUserInfo(name, city, state){
        dispatcher.dispatch({
           type:"USER_UPDATEUSERINFO",
           name:name,
           city:city,
           state:state,
        });
    }



