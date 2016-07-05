import React from "react";
import * as BookSearchActions from "../actions/BookSearchActions";
import Slider from "react-slick"


export default class ImageSliderItem extends React.Component {
  constructor() {
    super();
  }

  // action1Click()
  // {
  //   console.log("clicked action1, ",this.props,this.props.id)
  //   this.props.handle(this.props.id)
  //   BookSearchActions.deleteBook(this.props.id)
  // }
  
  render() {
    const {url, action1} = this.props
    var class1 =  "glyphicon glyphicon-"+this.props.glyph1+" fa-"+this.props.color1
    var class2 = false
    if (typeof(this.props.action2) != "undefined") 
    { 
       class2 = "glyphicon glyphicon-"+this.props.glyph2+" fa-"+this.props.color2
    }
    console.log("class1, class2 = ", class1, class2)
    
    return (
            <div class="profile-img-container">
            <img src={url} class="img-responsive"></img>
              <div class="icon-wrap"><span><i  class={class1} onClick = {this.props.action1.bind(this.props.this, this.props.id)}></i>
              {class2 && (
                              <i  class={class2}></i>
                              )}
              </span></div>
            </div>

    );
  }
}

