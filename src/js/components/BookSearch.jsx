import React from "react";
import BookSearchStore from "../stores/BookSearchStore";
import * as BookSearchActions from "../actions/BookSearchActions";
import BookSearchItem from "./BookSearchItem.jsx";
import Loader from 'react-loader'


export default class BookSearch extends React.Component {
  constructor() {
    super();
       this.onChange = this.onChange.bind(this)
        this.state = 
     {
       books: {},
      loaded:true,
     }

  }
  
    componentWillMount() {
    BookSearchStore.on("change", this.onChange);
  }

  componentWillUnmount() {
    BookSearchStore.removeListener("change", this.onChange);
       

  }
  

  
onChange() {
    console.log("books, on change received")
    this.setState({
      books: BookSearchStore.getFoundBooks(),
      loaded:true,
    });
    
  }
  
  handleSearch()
  {
          var searchString = this.refs.searchString.value
            this.setState({
                  books: {},
                  loaded:false,
                });
          BookSearchActions.findBook(searchString);

 
    console.log("Search string = ", searchString)
        
  }
  
  onKeyDown(event)
  {
    // event.preventDefault()
     if (event.keyCode === 13) {
      this.handleSearch();
    }

  }
  
  // onInputChange(event)
  // {
        
  //     this.setState({books:{}});
  // }
  
  hashCode (s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

  

  render() {
    var location = this.props;
    var books = [];
    console.log("isFetching ",this.state.isFetiching) ;
    console.log("state.books = ",this.state.books, this.state.books.length);
    if (typeof(this.state.books.items)!="undefined"){
        for (var i=0;i<3;i++) {
          var thumbLink
          if (typeof(this.state.books.items[i].volumeInfo.imageLinks) != "undefined") thumbLink = this.state.books.items[i].volumeInfo.imageLinks.smallThumbnail;

          var title = this.state.books.items[i].volumeInfo.title
          var description = this.state.books.items[i].volumeInfo.description
          var authorsArray = this.state.books.items[i].volumeInfo.authors
          var authors=""
          if (typeof(authorsArray) != "undefined") 
          {
            
            for (var j=0;j<authorsArray.length;j++)
            {
              authors+=authorsArray[j]+","
            }
            authors = authors.substring(0,authors.length-2)
          }
          if (typeof(description) == "undefined") description="";
          if (typeof(title) == "undefined") title="";
          if (typeof(thumbLink) == "undefined") thumbLink="";
          if (description.length>150) description=description.substring(0,150)+"..."
          
          books.push(<BookSearchItem key={this.hashCode(title)} handle={this.props.handle} this={this.props.this} thumbLink={thumbLink} title={title} description={description} authors={authors} />);
          console.log("link, title, descr =", thumbLink, title, description)
              }
          }
    return (
            <div class="panel panel-primary">
                <div class="panel-heading">
                  <h3 class="panel-title"><i class="glyphicon glyphicon-book"></i> Add Book</h3>
                </div>
                <div class="panel-body">
                  <div>
        
                    <p class="caption-addbook">Powered by</p>
                  </div>
                  <img src="http://img.talkandroid.com/uploads/2013/09/google-books.jpg" class="img-responsive center-block  newbook-icon"></img>
        
        
        
                  <div class="form-group label-floating">
        
                    <label class="control-label" for="addon2">Enter name</label>
                    <div class="input-group">
                      <input type="text" ref="searchString" id="addon2" class="form-control"  onKeyDown={this.onKeyDown.bind(this)}></input>
                      <span class="input-group-btn">
                        <div class="btn btn-primary btn-fab btn-fab-mini" onClick = {this.handleSearch.bind(this)}><i class="material-icons">search</i></div>
                  </span>
            </div>
          </div>
           <Loader loaded={this.state.loaded} color="#CCC" />
           {books}
           
        </div>
      </div>
    );
  }
}
