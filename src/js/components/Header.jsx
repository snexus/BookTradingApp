import React from "react";

export default class Header extends React.Component {
  constructor() {
    super();

  }

  render() {
    return (
        <div class="container-fluid header">
          <div class="row header hidden-xs">
            <div class="col-sm-12">
              <h2>Book Trading Application</h2>
              <h4>A convenient platform to explore, manage, catalogue and borrow books</h4>
            </div>
          </div>
        </div>
    );
  }
}