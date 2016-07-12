import dispatcher from "../dispatcher";


    export function loginSuccesfull(user){
        dispatcher.dispatch({
           type:"LOGIN_SUCCESS",
           user: user,
        });
    }
        export function updatePassword(password){
        dispatcher.dispatch({
           type:"UPDATEPASSWORD",
           password: password,
        });
    }
    export function loginFailed(msg){
        dispatcher.dispatch({
           type:"LOGIN_FAILED",
           message: msg,
        });
    }
    export function logout(){
        dispatcher.dispatch({
           type:"LOGOUT",
        });
    }


