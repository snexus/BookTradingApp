import React from "react";
import BookSearch from "./BookSearch.jsx";
import ImageSlider from "./ImageSlider.jsx";
import { IndexLink, Link } from "react-router";
import AuthStore from "../stores/AuthStore";
import BookSearchStore from "../stores/BookSearchStore";
import * as BookSearchActions from "../actions/BookSearchActions";
import Loader from 'react-loader'
import {Notification} from 'react-notification';
var socket=io();

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this)
    var loaded = true;
    socket.on("update", function(){
      console.log("Update required by server")
      BookSearchStore.updateBookListFromServer();
    });
    var userBooks = BookSearchStore.getUserBooks()
    if (userBooks.allBooks.length == 0) loaded = false;
    console.log("User books received = ", userBooks)
    this.state={
      myBooksSettings: {
        books: userBooks.allBooks,
        glyph1: "trash",
        color1: "red",
        action1: this.deleteBook
      },
      requestSettings: {
        books: userBooks.requests,
        glyph1: "remove",
        color1: "red",
        action1: this.cancelRequest
      },
      approvalSettings: {
        books: userBooks.approvals,
        glyph1: "thumbs-up",
        color1: "green",
        action1: this.approveRequest,
        glyph2: "thumbs-down",
        color2: "red",
        action2: this.declineRequest
      },

        messages:[{from:"App", messages:"Welcome to book trading"}],
      loaded: loaded,
      deleted: false,
      notification: false,
      notificationMessage: "",
    };
    //     this.state = 
    // {
    //   myBooksSettings:{books:{}, action1:"USER_DELETE_BOOK", glyph1:"trash", color1:"red"},
    //   requestSettings:{books:{}, action1:"USER_DELETE_BOOK", glyph1:"trash", color1:"red"},
    //   approvalSettings:{books:{}, action1:"USER_DELETE_BOOK", glyph1:"trash", color1:"red"},
    //   loaded:false,
    //   deleted:false,
    //   notification:false,
    //   notificationMessage:"",
    // }
    BookSearchStore.updateBookListFromServer();

  }

  componentWillMount() {
    BookSearchStore.on("change", this.onChange);
  }

  componentWillUnmount() {
    BookSearchStore.removeListener("change", this.onChange);

  }

  cancelRequest(bookId)
  {
    console.log("clicked cancelRequest, ", bookId);
    BookSearchActions.cancelBookRequest(bookId);
  }
  
  approveRequest(bookId)
  {
    console.log("clicked approveRequest, ", bookId);
    BookSearchActions.approveBookRequest(bookId);
  }
  
  declineRequest(bookId)
  {
    console.log("clicked declineRequest, ", bookId);
    BookSearchActions.declineBookRequest(bookId);
  }

  addBook(book) {
    console.log("addBook clicked")
      //  const {title, thumbLink, description, authors} = this.props;
    BookSearchActions.addBook(book)
    this.setState({
      loaded: false,
      deleted: false,
    });
    this.showNotification("Adding " + book.title + " to collection.");
  }

  deleteBook(bookId) {
    console.log("clicked deleteBook, ", bookId);
    // this.props.handle(this.props.id)
    BookSearchActions.deleteBook(bookId);
    this.setState({
      loaded: false,
      deleted: true,
    });
    this.showNotification("Deleting from collection.");
  }

  onChange() {
    console.log("Dashboard - on change received")
    var userBooks = BookSearchStore.getUserBooks()
    console.log("User books received = ", userBooks)
    this.setState({
      myBooksSettings: {
        books: userBooks.allBooks,
        glyph1: "trash",
        color1: "red",
        action1: this.deleteBook
      },
      requestSettings: {
        books: userBooks.requests,
        glyph1: "remove",
        color1: "red",
        action1: this.cancelRequest
      },
      approvalSettings: {
        books: userBooks.approvals,
        glyph1: "thumbs-up",
        color1: "green",
        action1: this.approveRequest,
        glyph2: "thumbs-down",
        color2: "red",
        action2: this.declineRequest
      },

        messages:userBooks.messages,
     
      loaded: true,
    });

  }

  showNotification(message) {
    this.setState({
      notification: true,
      notificationMessage: message
    });
    var that = this;
    setTimeout(function() {
      that.setState({
        notification: false,
        notificationMessage: ""
      });
    }, 3000)
  }


  render() {
    var myBooksContent = <h5>No books</h5>
    var myRequestContent = <h5>You can request to borrow from All Books page</h5>
    var myApprovalContent = <h5>No books are awaiting for approval </h5>
    if (Object.keys(this.state.myBooksSettings.books).length != 0) {
      myBooksContent = <ImageSlider settings={this.state.myBooksSettings} this={this} deleted={this.state.deleted}/>
    }

    if (Object.keys(this.state.requestSettings.books).length != 0) {
      myRequestContent = <ImageSlider settings={this.state.requestSettings} this={this} deleted={this.state.deleted}/>
    }

    if (Object.keys(this.state.approvalSettings.books).length != 0) {
      myApprovalContent = <ImageSlider settings={this.state.approvalSettings} this={this} deleted={this.state.deleted}/>
    }

    var snackbarStyle = {
      left: '-50%',
      fontFamily: "Roboto"
    };


    var messages = this.state.messages.map(function(message){return(
            <p class="message"><span class="message message-from">{message.from}:</span> {message.message}</p>
      );});
    return (
      <div>
  <Notification isActive={this.state.notification} message={this.state.notificationMessage}  action={""} style={snackbarStyle} />
  <div class="row">

    <div class="col-sm-12 top-tab">


      <Link to="settings" class="btn btn-default  btn-xs"><i class="material-icons grey">settings</i>User Settings</Link>
      

    </div>


  </div>
  <div class="row">
    <div class="col-sm-5">

      <BookSearch handle={this.addBook} this={this} />
      <div class="panel panel-primary">
        <div class="panel-heading">
          <h3 class="panel-title"><i class="glyphicon glyphicon-envelope"></i> Messages</h3>
        </div>
        <div class="panel-body">
          {messages}
        </div>
      </div>

  <span class="error-message"> <i class="glyphicon glyphicon-info-sign"></i> Hover over book cover for context dependend actions</span>

    </div>

    <div class="col-sm-7">


      <div class="panel panel-info">
        <div class="panel-heading">
          <h3 class="panel-title"><i class="glyphicon glyphicon-th"></i> My Books  </h3>
        </div>

        <div class="panel-body">

          <div class="row">
            <div class="col-md-12">
             {myBooksContent}
             <Loader loaded={this.state.loaded} color="#03a9f4" />
            </div>


          </div>
        </div>
      </div>

      <div class="panel panel-info">
        <div class="panel-heading">
          <h6 class="panel-title"><i class="glyphicon glyphicon-star"></i> My Requests  </h6>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-md-12">
             {myRequestContent}

            </div>


          </div>
        </div>
      </div>
      <div class="panel panel-info">
        <div class="panel-heading">
          <h6 class="panel-title"><i class="glyphicon glyphicon-check"></i> Awaiting Approval <span class="badge">{Object.keys(this.state.approvalSettings.books).length}</span></h6>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-md-12">
             {myApprovalContent}

            </div>


          </div>
        </div>
      </div>
    </div>

  </div>
</div>

    );
  }
}

// <button class="btn btn-default  btn-xs"><i class="material-icons grey">message</i> Message User</button>