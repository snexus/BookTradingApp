import React from "react";
import Gallery from "./Gallery.jsx";
// import ImageSliderItem from "./ImageSliderItem.jsx";
import BookSearchStore from "../stores/BookSearchStore";
import * as BookSearchActions from "../actions/BookSearchActions";
import Loader from 'react-loader'
import {Notification} from 'react-notification';

var masonryOptions = {
    transitionDuration: 500
};
var socket=io();

export default class BooksGridLayout extends React.Component {
constructor(props) {
    super(props);
    
    socket.on("update", function(){
      console.log("BookGrid: Update required by server")
      BookSearchStore.getAllBooksFromServer();
    });
    
    this.onChange = this.onChange.bind(this)
        var userBooks = BookSearchStore.getAllBooks()
    console.log("User books received = ", userBooks)
    this.state={
       allBooksSettings:{books:userBooks,  glyph1:"trash", color1:"red", action1:this.action1},
        filterString:"",notification: false,
      notificationMessage: "",
    };

    // this.state = {
    //   allBooksSettings:{books:[],  glyph1:"trash", color1:"red", action1:this.action1},
    //   filterString:"",

    // };
     BookSearchStore.getAllBooksFromServer();
  }
  
     componentWillMount() {
    BookSearchStore.on("change", this.onChange);
  }

  componentWillUnmount() {
    BookSearchStore.removeListener("change", this.onChange);

  }

    onInputChange(event)
  {
    if (event.keyCode === 13) {
      event.preventDefault()
    }
      // event.preventDefault()
       this.filterSearch()

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
  
  
filterSearch()
  {
            this.setState({
                  filterString: this.refs.filterString.value,
                });
    console.log("filter string = ", this.refs.filterString.value);
  }
  
    
action1(bookId){
        console.log("BooksGridLayout: action1, bookId = ", bookId);
        BookSearchActions.requestBook(bookId);
        this.showNotification("Performing request book action")
        
    }
    
    onChange() {
    console.log("All Books - on change received")
    var userBooks = BookSearchStore.getAllBooks()
    console.log("User books received = ", userBooks)
    this.setState({
       allBooksSettings:{books:userBooks,  glyph1:"trash", color1:"red", action1:this.action1},
     
    });
 
  }


  render() {
      
    var books = this.state.allBooksSettings.books  
        var snackbarStyle = {
      left: '-50%',
      fontFamily: "Roboto"
    };


    if (books.length==0)
    {
        console.log("Empty books, return");
        return  <div class="top-tab"><Loader loaded={false} color="#CCC" /></div>;
    }
    console.log("All books state = ", this.state)
    const {action1, glyph1, color1} = this.state.allBooksSettings
        if (typeof(this.state.allBooksSettings.action2) != "undefined") 
    { 
       var {action2, glyph2, color2} =  this.state.allBooksSettings;
    }
    
    console.log("inside BookGrid - act1,gly1,col1,act2,gly2,col2 = ",action1, glyph1, color1,action2, glyph2, color2)
    var booksArray = []
    console.log("BookGrid: book, length = ", books, books.length)
    for (var i=0;i<books.length;i++)
    {
      let url ="";
      let authors="";
      
      if (typeof(books[i].thumbLink) != "undefined") url = books[i].thumbLink;
      let title=books[i].title
      if (typeof(books[i].authors) != "undefined") authors = books[i].authors;
    //   booksArray.push(<ImageSliderItem src={url} key={books[i]._id} this={this} id={books[i]._id} action1={action1} color1={color1} action2={action2} color2={color2} glyph1={glyph1} glyph2={glyph2} />);
    console.log("url=", url)
        booksArray.push({src:url, title:title, authors:authors, key:books[i]._id, requestedBy:books[i].requestedBy, owner:books[i].owner, action1:action1, this:this})
      }
      var filteredArray=booksArray;
      var filterString = this.state.filterString
      if (filterString!="")
      {
          filteredArray=booksArray.filter(function(book){
              console.log("book title, authors = ", book.title, book.authors)
              return (book.title.toLowerCase().indexOf(filterString.toLowerCase())>-1) || (book.authors.toLowerCase().indexOf(filterString.toLowerCase())>-1)
          });
      }
     var class1 =  "glyphicon glyphicon-"+glyph1+" fa-"+color1
     console.log("BookGridLayout: booksArray = ", booksArray)
    return (
    <div>
      <Notification isActive={this.state.notification} message={this.state.notificationMessage}  action={""} style={snackbarStyle} />
    <div class="row">
        <div class="col-xs-12">
        <form class="form-inline top-tab" role="form">
          <div class="form-group has-primary has-feedback">
            <label class="control-label" for="inputSuccess4"></label>
            <input type="text" ref="filterString" class="form-control" id="inputSuccess4" onChange={this.onInputChange.bind(this)}></input>
            <i class="glyphicon glyphicon-search form-control-feedback"></i>
          </div>
        </form>
        </div>
        </div>
      <Gallery  elements={filteredArray} />

     </div>
     )

  }
}

// "https://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=87662516"
// {typeof(book.thumbLink) == "undefined" ? "":book.thumbLink}
    //   books.map((book, index) =>{
    //     return();
    //     })
            //       <div class="icon-wrap"><span><i  class={class1} ></i>
            //   </span></div>
            // </div>
            //             <div class="profile-img-container" key={"123"}>