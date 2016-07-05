import React from "react";

export default class Footer extends React.Component {
  constructor() {
    super();

  }

  render() {
    var location = this.props;
    return (
             <div class="container-fluid footer">
               <div class="row">
                  <hr></hr>
                     <div class="col-sm-12">
   
                         <h5>Designed and coded by snexus</h5>
                     </div>
               </div>
            </div>
    );
  }
}
