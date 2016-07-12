import React from  "react";
import Masonry from "react-masonry-component";
import AuthStore from "../stores/AuthStore";

var masonryOptions = {
    transitionDuration: 1,
};

export default class Gallery extends React.Component{
    
    render() {
        var childElements = this.props.elements.map(function(element){
            var owner = element.owner
            var requestedBy = element.requestedBy
            console.log("inside gallery, owner, requestedBy = ", owner, requestedBy, AuthStore.getCurrentUser())
            var displayOverlay = ((AuthStore.getCurrentUser()=="") || (owner == AuthStore.getCurrentUser()) || (requestedBy!="")) ? false : true;
            console.log("displayOverlay = ", displayOverlay)
            
           return (
               


          <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" key={element.key}>
            <div class="thumbnail article profile-img-container">
              <img src={element.src} alt="No cover"></img>
                                       <div class="icon-wrap icon-gallery">
                                       {displayOverlay && 
                                       (<span><i  class="glyphicon glyphicon-refresh fa-red" onClick = {element.action1.bind(element.this, element.key)}></i></span>)}
                                       </div>
              <div class="caption">
                <h5 class="article-header">{element.title}</h5>
                <p class="author">{element.authors}</p>
              </div>
          </div>
        </div>

            );
        });
        console.log("Gallery: child elements", childElements)
        return (
            <row>
            <Masonry
               
                elementType={'div'} // default 'div'
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
                updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
            >

                {childElements}
   
            </Masonry>
            </row>
        );
    }
};

                // <li className="image-element-class">
                //   <div class="profile-img-container">
                //         <img src={element.src} ></img>
                //           <div class="icon-wrap"><span><i  class="glyphicon glyphicon-plus fa-green"></i>

                //           </span></div>
                //         </div>
                // </li>