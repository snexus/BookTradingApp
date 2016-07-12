import React from "react";
import * as AuthActions from "../actions/AuthActions";
import { IndexLink, Link } from "react-router";
import AuthStore  from "../stores/AuthStore";
import BookSearchStore from "../stores/BookSearchStore";
import * as BookSearchActions from "../actions/BookSearchActions";

export default class Settings extends React.Component {
  constructor() {
    super();
     this.onChange = this.onChange.bind(this)
     this.onChangeBS = this.onChangeBS.bind(this)
     this.passwOnKeyDown = this.passwOnKeyDown.bind(this)
      this.handlePasswordChange = this.handlePasswordChange.bind(this)
      this.handleUpdateUserInfo=this.handleUpdateUserInfo.bind(this)
      this.state={passChangeMsg:"", name:"",city:"",state:""};
      BookSearchStore.getUserInfoFromServer();

  }
  
  handlePasswordChange(event) {
    event.preventDefault()

    var password = this.refs.password.value
    AuthActions.updatePassword(password)
  }
  
handleUpdateUserInfo(event){
  event.preventDefault()
  var name = this.refs.name.value
  var city = this.refs.city.value
  var state = this.refs.state.value
  console.log("pressed handleUpdateUserInfo with ",name, city,state)
  BookSearchActions.updateUserInfo(name, city, state);
}

 componentWillMount() {
   AuthStore.on("change", this.onChange);
     BookSearchStore.on("change", this.onChangeBS);
  }

  componentWillUnmount() {
    AuthStore.removeListener("change", this.onChange);
      BookSearchStore.removeListener("change", this.onChangeBS);

  }
  
  onChange() {
    var userInfo = BookSearchStore.getUserInfo()
    console.log("Setting on change, got user info ", userInfo)
    this.setState({passChangeMsg:AuthStore.getPassChangeMsg(), name:userInfo.name, city:userInfo.city, state:userInfo.state})
  }
  
    onChangeBS() {
    var userInfo = BookSearchStore.getUserInfo()
    console.log("Setting on change, got user info ", userInfo)
    this.setState({name:userInfo.name, city:userInfo.city, state:userInfo.state})
  }
  
  passwOnKeyDown()
  {
      this.setState({passChangeMsg:""})
  }

  render() {
    var location = this.props;
    return (
<div>
    <div class="row">

    <div class="col-sm-12 top-tab">


      <Link to="dashboard" class="btn btn-default  btn-xs"><i class="material-icons grey">dashboard</i> Dashboard</Link>
      

    </div>


  </div>

<div class="row">

        <div class="col-sm-3"></div>


        <div class="col-sm-6">
<div class="panel panel-primary">
                        <div class="panel-heading">
              <h3 class="panel-title"><i class="glyphicon glyphicon-user"></i> Update User Information</h3>
            </div>
          <div class="panel-body">
          <form class="update-form" onSubmit={this.handleUpdateUserInfo.bind(this)}>
            <div class="row">
            <div class="col-sm-12">
            <div class="form-group">
 <label class="control-label" for="inputName">Full Name</label>
              <input type="text" ref="name" class="form-control" id="inputName" placeholder={this.state.name}></input>
            </div>
            </div>
            </div>
                        <div class="row">
            <div class="col-sm-6">
            <div class="form-group">
<label class="control-label" for="inpuCity">City</label>
              <input type="text" ref="city" class="form-control" id="inputCity" placeholder={this.state.city}></input>
            </div>
            </div>
             <div class="col-sm-6">
            <div class="form-group">
   <label class="control-label" for="inputState">State</label>
              <input type="text" class="form-control" ref="state" id="inputState" placeholder={this.state.state}></input>
            </div>

            </div>

            </div>


      
                
            <button type="submit" class="btn btn-raised btn-sm">Update</button>
           <span class="error-message"> <i class="glyphicon glyphicon-info-sign"></i>  Optional information</span>
             </form>



        </div>
        </div>
        </div>

         <div class="col-sm-3"></div>
  </div>
            <div class="row">
            <div class="col-sm-3"></div>
                   <div class="col-sm-6">
                          <div class="panel panel-primary">
                        <div class="panel-heading">
              <h3 class="panel-title"><i class="glyphicon glyphicon-pencil"></i> Change Password</h3>
            </div>
          <div class="panel-body">
     

          <form onSubmit={this.handlePasswordChange.bind(this)} class="update-form">
            <div class="row">
            <div class="col-sm-12">
            <div class="form-group">
 <label class="control-label" for="inputPassword">Password Settings</label>
              <input type="password" ref="password" class="form-control" id="inputName" placeholder="Enter new pasword" onKeyDown={this.passwOnKeyDown.bind(this)}></input>
            </div>
            </div>
            </div>
   
            
            <button type="submit" class="btn btn-raised btn-sm">Change</button>
            {(this.state.passChangeMsg!="") && (
 <span class="error-message"> <i class="glyphicon glyphicon-info-sign"></i>  Password was changed</span>)}

       </form>

        </div>
    </div>
    </div>
            </div>
        <div class="col-sm-3"></div>


</div>

    );
  }
}
            //   <label for="inputName">Full Name</label>
            //                 <label for="inpuCity">City</label>
            //                               <label for="inputState">State</label>
              
            //                 <label for="inputPassword">Change Password</label>