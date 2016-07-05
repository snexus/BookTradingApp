import React from "react";
import { IndexLink, Link, withRouter } from "react-router";
import * as auth from "../auth/clientAuth.js";
import * as AuthActions from "../actions/AuthActions";


class Signup extends React.Component {
  constructor() {
     super()
     this.state = {
        error: false,
        message:""
      }
  }


    
    handleSubmit(event) {
      event.preventDefault()
        console.log("handleSubmit, this = ",this)
      var email = this.refs.username.value
      var pass = this.refs.pass.value
      var pass2 = this.refs.pass2.value
      console.log("inside submit, login, pass, pass2 = ", email, pass, pass2)
      if (pass!=pass2) return this.setState({ error: true, message:"Passwords don't match" })

      
      auth.signupOnServer(email, pass, function(error, message){
        if (!error)
        {
              auth.login(email, pass, function(loggedIn) {
                  // console.log("this after auth = ",this)
                  if (!loggedIn) {
                    return this.setState({ error: "Couldn't login", message: message })
                  }
            

                  AuthActions.loginSuccesfull(email)
                  var location = this.props
                  if (location.state && location.state.nextPathname) {
                    this.props.router.replace(location.state.nextPathname)
                  }
                  else {
                    this.props.router.replace('dashboard')
                  }
                }.bind(this))
        }
        console.log("inside callback, error, message = ", error, message)
            return this.setState({ error: error, message: message })
      
      }.bind(this))
    }
    


    render() {
    

      return (
        // <form onSubmit={this.handleSubmit}>
        //   <label><input ref="username" placeholder="Username" defaultValue="joe@example.com" /></label><br />
        //   <label><input ref="pass" placeholder="Password" /></label><br />
        //   <label><input ref="pass2" placeholder="Confirm password" /></label><br />
        //   <button type="submit">Signup</button>
        //   {this.state.error && (
        //     <p>{this.state.message}</p>
        //   )}
          
        // </form>
<div class="container container-body">

                <div class="row">
                  <div class="col-sm-12">
                    <div class="row">
                      <div class="col-sm-1"></div>
                      <div class="col-sm-5 vertical-center">
                        <img src="/resource/images/book-and-light.png" class="img-responsive center-block  image"></img>
                      </div>
            
            
                      <div class="col-sm-5 login-form">
            
                        <form onSubmit={this.handleSubmit.bind(this)}>
                                         
                          <div class="form-group">
                            <label class="control-label" for="inputLogin">Username</label>
                            <input type="text" ref="username" class="form-control" id="inputLogin" placeholder="Username"></input>

                          </div>
            
                          <div class="form-group">
                            <label class="control-label" for="inputPassword">Password</label>
                            <input type="password" ref="pass" class="form-control" id="inputPassword" placeholder="Password"></input>
                          </div>
                            <div class="form-group">
                            <label class="control-label" for="inputPassword2">Repeat password</label>
                            <input type="password" ref="pass2" class="form-control" id="inputPassword2" placeholder="Repeat password"></input>
                          </div>
                            <p className="message">Already registered? <Link to="login">Sign In</Link></p>
            
                          <button type="submit" class="btn btn-raised btn-primary ">Sign Up</button>
                              {this.state.error && (
                               <span class="error-message"> <i class="glyphicon glyphicon-warning-sign"></i>  {this.state.message}</span>

                              )}
                        </form>
            
                      </div>
                    </div>
            
            
                  </div>
                </div>
              </div>
        

      )
    }
  }
  
var signup = withRouter(Signup)
export default signup;

    