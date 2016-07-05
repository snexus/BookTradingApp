import React from "react";
import Nav  from "../components/Nav.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default class App extends React.Component {
  constructor() {
    super();

  }

  render() {
    var location = this.props;
    return (
              <div>
                <Nav location={location}/>
                <Header />
                <div className="container body1">
                  <div class="row">
                    <div class="col-sm-12">
                      {this.props.children}
                    </div>
                  </div>
                 </div>
                <Footer />
                </div>
    );
  }
}

