import React from "react";
import Slider from "react-slick"
import ImageSliderItem from "./ImageSliderItem.jsx";


export default class ImageSlider extends React.Component {
  constructor() {
    super();


  }

  
  render() {
    const books = this.props.settings.books
    // var lastSlide=books.length-1
    // if (this.props.deleted)
    // {
    //   lastSlide=1;
    // }
    // console.log("Book Length = ", books, this.props.deleted, lastSlide)
     var settings = {
      dots: false,
      infinite: false,
      slidesToShow: 4,

      className: "slides"
    };

   // let url = "http://books.google.com.au/books/content?id=9U5I_tskq9MC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api" 
    console.log("inside ImageSlider, books = ", books, this.props.settings)
    
    const {action1, glyph1, color1} = this.props.settings

    if (typeof(this.props.settings.action2) != "undefined") 
    { 
       var {action2, glyph2, color2} = this.props.settings;
    }
    console.log("inside ImageSlider - act1,gly1,col1,act2,gly2,col2 = ",action1, glyph1, color1,action2, glyph2, color2)
    var booksArray = []
    var bookObjLength = books.length
    for (var i=0;i<books.length;i++)
    {
      let url ="https://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=87662516"
      if (typeof(books[i].thumbLink) != "undefined") url = books[i].thumbLink;
      
      booksArray.push(<ImageSliderItem url={url} key={books[i]._id} this={this.props.this} id={books[i]._id} action1={action1} color1={color1} action2={action2} color2={color2} glyph1={glyph1} glyph2={glyph2} />);
      }

              
    return (
            <div class="slider-container">
            <Slider {...settings}>
              {booksArray}

            </Slider>
            </div>

    );
  }
}

                // <div class="carousel-inner">
                //   <div class="item active">
                //     <div class="col-xs-4">
                //       <a href="#1"><img src="https://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=87662516" class="img-responsive"></img>
                //       </a>
                //     </div>
                //   </div>

                // </div>
                // <a class="left carousel-control" href="#theCarousel" data-slide="prev"><i class="glyphicon glyphicon-chevron-left"></i></a>
                // <a class="right carousel-control" href="#theCarousel" data-slide="next"><i class="glyphicon glyphicon-chevron-right"></i></a>
                
              //   <ImageSliderItem url={url} action1={action1} color1={color1} action2={action2} color2={color2} glyph1={glyph1} glyph2={glyph2} />
              // <ImageSliderItem url={url} action1={action1} color1={color1} action2={action2} color2={color2} glyph1={glyph1} glyph2={glyph2} />
              // <ImageSliderItem url={url} action1={action1} color1={color1} action2={action2} color2={color2} glyph1={glyph1} glyph2={glyph2} />
              // <ImageSliderItem url={url} action1={action1} color1={color1} action2={action2} color2={color2} glyph1={glyph1} glyph2={glyph2} />
              // <ImageSliderItem url={url} action1={action1} color1={color1} action2={action2} color2={color2} glyph1={glyph1} glyph2={glyph2} />
              // <ImageSliderItem url={url} action1={action1} color1={color1} action2={action2} color2={color2} glyph1={glyph1} glyph2={glyph2} />