import React from "react";
import {IndexLink,  Link,  withRouter} from "react-router";
import * as auth from "../auth/clientAuth.js";
import AuthStore from "../stores/AuthStore";
import * as AuthActions from "../actions/AuthActions";

class Login extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this)
        this.state = 
     {
       error: false,
     }

  }

  componentWillMount() {
    AuthStore.on("change", this.onChange);
  }

  componentWillUnmount() {
    AuthStore.removeListener("change", this.onChange);

  }


  onChange() {
    console.log("Login - on change received")
    this.setState({
      error: AuthStore.getLoginError()
    });
    console.log("error = ", AuthStore.getLoginError())
  }

  handleSubmit(event) {
    event.preventDefault()

    var email = this.refs.email.value
    var pass = this.refs.pass.value
    console.log("auth = ", auth)

    auth.login(email, pass, function(loggedIn) {
      // console.log("this after auth = ",this)
      if (!loggedIn) {
        return AuthActions.loginFailed("Invalid username or password data");
      }

      //  return this.setState({ error: true })
      //this.setState({user:email,token:auth.getToken()});
      //console.log("Seems to login succesfully");
      AuthActions.loginSuccesfull(email)
      var location = this.props
      console.log("location = ", location)
      if (location.state && location.state.nextPathname) {
        this.props.router.replace(location.state.nextPathname)
      }
      else {
        this.props.router.replace('dashboard')
      }
    }.bind(this))
  }

  render() {
    return (
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
                            <input type="text" ref="email" class="form-control" id="inputLogin" placeholder="Username"></input>

                          </div>
            
                          <div class="form-group">
                            <label class="control-label" for="inputPassword">Password</label>
                            <input type="password" ref="pass" class="form-control" id="inputPassword" placeholder="Password"></input>
                          </div>
                          <p class="message">Not registered? <Link to="signup">Create an account</Link></p>
            
                          <button type="submit" class="btn btn-raised btn-primary ">Login</button>
                                                    {this.state.error && (
                                   <span class="error-message"> <i class="glyphicon glyphicon-warning-sign"></i>  Invalid login information</span>
                              )}
                              {this.props.message && (
                                <p className="error-message">{this.props.message}</p>
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

var login = withRouter(Login)
export default login;