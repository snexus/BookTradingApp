import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import * as auth from "../auth/clientAuth.js";

class  AuthStore extends EventEmitter {
constructor() {
    super()
    this.loginError = ""
    this.user = ""
    this.passwChangeStatus = "";
}

logout()
{
   this.user = "";
   this.emit("change");
}

updatePassword(pass) {
     this.passwChangeStatus="";
        var xhr = new XMLHttpRequest();
        var token = auth.getToken();
        var updatePass = 'passw=' + encodeURIComponent(pass)+'&token='+encodeURIComponent(token);
        xhr.open('post', '/updatepassw');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
        xhr.responseType = 'json';
        xhr.onload = function() {
         if (xhr.status == 200) {
             this.passwChangeStatus="Password was updated.";
            
          } else {
            this.passwChangeStatus="Password update has failed.";
          }
           this.emit("change");
       }.bind(this);
      xhr.send(updatePass);
}


setErrorMsg(msg) {
    console.log("inside setErrorMsg, msg = ", msg)
        this.loginError = msg;
        this.user="";
       this.emit("change");
    }

setUserName(userName) {
    this.user = userName;
       this.emit("change");
    }
    
getPassChangeMsg()
{
    return this.passwChangeStatus;
}
getCurrentUser() {
        return this.user;
    }
    
getLoginError()
    {
        return this.loginError;
    }

//   // Emit Change event
//   emitChange() {
//     this.emit('change');
//   }

//   // Add change listener
//   addChangeListener(callback) {
//     this.on('change', callback);
//   }

//   // Remove change listener
//   removeChangeListener(callback) {
//     this.removeListener('change', callback);
//   }
  
    handleActions(action) {
        switch(action.type) {

    // Respond to RECEIVE_DATA action
    case "LOGIN_FAILED":
        this.setErrorMsg(action.message);
        break;

    // Respond to SELECT_PRODUCT action
    case "LOGIN_SUCCESS":
        this.setUserName(action.user);
        break;
    case "LOGOUT":
        this.logout();
        break;
    
    case "UPDATEPASSWORD":
        this.updatePassword(action.password);
        break;
    
    

    default:
      return true;
  }  
        
    }


};

const authStore = new AuthStore;
dispatcher.register(authStore.handleActions.bind(authStore));
export default authStore;
