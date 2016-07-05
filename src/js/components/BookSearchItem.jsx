import React from "react";
import BookSearchStore from "../stores/BookSearchStore";
import * as BookSearchActions from "../actions/BookSearchActions";

export default class BookSearchItem extends React.Component {
  constructor() {
    super();

  }
  
  // addBook()
  // {
  //   console.log("addBook clicked")
  //   const {title, thumbLink, description, authors} = this.props;
  //   BookSearchActions.addBook({title:title, thumbLink:thumbLink, authors:authors})
  // }
  
  render() {
    const {title, thumbLink, description, authors} = this.props;
    console.log("BookSearchItem: props ", this.props)
    return (
          <div class="media booksearch" onClick={this.props.handle.bind(this.props.this, {title:title, thumbLink:thumbLink, authors:authors}) }>
            <div class="media-left media-middle ">
  
                <img class="media-object booksearch-image" src={thumbLink} alt="No cover"></img>
  
            </div>
            <div class="media-body">
              <h5>{title}</h5>
              <h6>{authors}</h6>
              <p>{description}</p>
            </div>
        </div>
    );
  }
}
