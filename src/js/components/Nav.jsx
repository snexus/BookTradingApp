import React from "react";
import { IndexLink, Link } from "react-router";
import AuthStore  from "../stores/AuthStore";
import * as auth from "../auth/clientAuth.js";
import * as AuthActions from "../actions/AuthActions";

export default class Nav extends React.Component {
  constructor() {
     super();
     this.onChange = this.onChange.bind(this)
     this.state = 
     {
       userLoggedIn: false,
     };
            }

    
    
    
    componentWillMount()
    {
    AuthStore.on("change", this.onChange);
      
    }
    
     componentWillUnmount() {
         AuthStore.removeListener("change", this.onChange);

  }

    
    onChange()
    {
      console.log("nav - on change received")
      this.setState({userLoggedIn:AuthStore.getCurrentUser()});

    }
    
    handleLogout()
    {
        auth.logout(function(){
            return AuthActions.logout();
        })
       
    }
    
    
    render(){
    var location = this.props.location.location;
    // console.log("location = ",location)
    var homeClass = location.pathname === "/" ? "active" : "";
    var pollsClass = location.pathname.match(/^\/polls/) ? "active" : "";
    var dashboardClass = location.pathname.match(/^\/dashboard/) ? "active" : "";
    var loginClass = location.pathname.match(/^\/login/) ? "active" : "";
    var logoutClass = location.pathname.match(/^\/logout/) ? "active" : "";
    var signupClass = location.pathname.match(/^\/signup/) ? "active" : "";
    var loginText = "Login";
    
    
    if (this.state.userLoggedIn)
    {
        loginText = "Logout";
    }
    console.log("signupClas = ", signupClass)
        return(
                <nav role="navigation" className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" data-target="#navbarCollapse" data-toggle="collapse" className="navbar-toggle">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a href="#" className="navbar-brand">BooKApp</a>
                        </div>
                       
                        <div id="navbarCollapse" className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li className={homeClass}><a href="#">Home</a></li>
                                <li className={pollsClass}> <Link to="allBooks">All Books</Link></li>
                                <li className={dashboardClass}><Link to="dashboard">Dashboard</Link></li>
                            </ul>
                                {!this.state.userLoggedIn && (
                             <ul className="nav navbar-nav navbar-right">
                                <li  className={loginClass}><Link to="login">Login</Link></li>
                              <li className={signupClass}><Link to="signup">Sign Up</Link></li>
                            </ul>
                              )}
   
                                 {this.state.userLoggedIn && (
                                    <div>
                                        <ul className="nav navbar-nav navbar-right">
                                            <li  className={logoutClass} onClick={this.handleLogout}><a href="#">Logout</a></li>
                                         
                                        </ul>
                                         <div className="collapse navbar-collapse">
                                             <p className="nav navbar-text pull-right">Welcome, {this.state.userLoggedIn}</p>
                                        </div>
                                    </div>
                              )}
                              
                        </div>
                    </div>
                </nav>
        )
    }
}


