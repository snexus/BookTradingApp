import { EventEmitter } from "events";
import dispatcher from "../dispatcher";


class  AuthStore extends EventEmitter {
constructor() {
    super()
    this.loginError = ""
    this.user = ""
}

logout()
{
   this.user = "";
   this.emit("change");
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

    default:
      return true;
  }  
        
    }


};

const authStore = new AuthStore;
dispatcher.register(authStore.handleActions.bind(authStore));
export default authStore;
