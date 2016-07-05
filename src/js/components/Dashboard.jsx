import React from "react";
import BookSearch from "./BookSearch.jsx";
import ImageSlider from "./ImageSlider.jsx";
import AuthStore from "../stores/AuthStore";
import BookSearchStore from "../stores/BookSearchStore";
import * as BookSearchActions from "../actions/BookSearchActions";
import Loader from 'react-loader'
import { Notification } from 'react-notification';

export default class Dashboard extends React.Component {
  constructor() {
    super();
 this.onChange = this.onChange.bind(this)

        this.state = 
     {
       myBooksSettings:{books:{}, action1:"USER_DELETE_BOOK", glyph1:"trash", color1:"red"},
       loaded:false,
       deleted:false,
       notification:false,
       notificationMessage:"",
     }
       BookSearchStore.updateBookListFromServer();

  }
  
   componentWillMount() {
    BookSearchStore.on("change", this.onChange);
  }

  componentWillUnmount() {
    BookSearchStore.removeListener("change", this.onChange);

  }

    addBook(book)
  {
    console.log("addBook clicked")
  //  const {title, thumbLink, description, authors} = this.props;
    BookSearchActions.addBook(book)
    this.setState({loaded:false,deleted:false,});
    this.showNotification("Adding "+book.title+" to collection.");
  }
  
    deleteBook(bookId)
  {
    console.log("clicked deleteBook, ", bookId);
    // this.props.handle(this.props.id)
    BookSearchActions.deleteBook(bookId);
     this.setState({loaded:false,deleted:true,});
    this.showNotification("Deleting from collection.");
  }

  onChange() {
    console.log("Dashboard - on change received")
    var userBooks = BookSearchStore.getUserBooks()
    console.log("User books received = ", userBooks)
    this.setState({
       myBooksSettings:{books:userBooks,  glyph1:"trash", color1:"red", action1:this.deleteBook},
       loaded:true,
    });
 
  }
  
  showNotification(message)
  {
    this.setState({notification:true, notificationMessage:message});
    var that = this;
    setTimeout(function()
    {that.setState({notification:false, notificationMessage:""});},3000)
  }
  

  render() {
  var myBooksContent = <h5>No books</h5>
  if (Object.keys(this.state.myBooksSettings.books).length != 0)
  {
    myBooksContent = <ImageSlider settings={this.state.myBooksSettings} this={this} deleted={this.state.deleted}/>
  }
  var snackbarStyle = {
  left: '-50%',
  fontFamily:"Roboto"
  };
  
    return (
<div>
  <Notification isActive={this.state.notification} message={this.state.notificationMessage}  action={""} style={snackbarStyle} />
  <div class="row">

    <div class="col-sm-12 top-tab">


      <button class="btn btn-default  btn-xs"><i class="material-icons grey">settings</i> Settings</button>
      <button class="btn btn-default  btn-xs"><i class="material-icons grey">message</i> Message User</button>

    </div>


  </div>
  <div class="row">
    <div class="col-sm-5">

      <BookSearch handle={this.addBook} this={this} />
      <div class="panel panel-primary">
        <div class="panel-heading">
          <h3 class="panel-title"><i class="glyphicon glyphicon-envelope"></i> Messages <span class="badge">0</span></h3>
        </div>
        <div class="panel-body">
          <h5>No messages</h5>
        </div>
      </div>
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
          <h5>You can request to borrow from All Books page</h5>

        </div>
      </div>
      <div class="panel panel-info">
        <div class="panel-heading">
          <h6 class="panel-title"><i class="glyphicon glyphicon-check"></i> Awaiting Approval <span class="badge">0</span></h6>
        </div>
        <div class="panel-body">
          <h5>No books are awaiting for approval </h5>
        </div>
      </div>
    </div>

  </div>
</div>

    );
  }
}