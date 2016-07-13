  export function login (email, pass, cb) {
    delete localStorage.token;
    cb = arguments[arguments.length - 1];
    authOnServer(email, pass, function(res){
        console.log("pretendRequest res = ",res)
      if (res.authenticated) {
        localStorage.token = res.token
        if (cb) cb(true)
      } else {
        if (cb) cb(false)
      }
    });
  }

  export function signupOnServer(login, pass, cb)
  {
    var xhr = new XMLHttpRequest();
    var user = 'login=' + encodeURIComponent(login) + '&password=' + encodeURIComponent(pass);
    xhr.open('post', '/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    xhr.responseType = 'json';
    xhr.onload = function() {
      console.log("Server returned ", this.status);
      var error = true;
        if (this.status === 404) {
       return cb(error,"Network error has occured" );
       
    }
     if (this.status == 200)    error = false;
     
     return cb(error,this.response.message );
   };
    
  xhr.send(user);
  }

  export function getToken() {
    return localStorage.token
  }

  export function logout(cb) {
    delete localStorage.token
    if (cb) cb()
  }

  export function loggedIn() {
      console.log("localStorage token = ", localStorage)
    
    return !!localStorage.token
    
  }




function pretendRequest(email, pass, cb) {
  
// debugging purposes
  setTimeout(function() {
      
    if (email === 'joe@example.com' && pass === 'password1') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      })
    } else {
      cb({ authenticated: false })
    }
  }, 0)}
  
  
  function authOnServer(login, pass, cb)
  {
    var xhr = new XMLHttpRequest();
    var user = 'login=' + encodeURIComponent(login) + '&password=' + encodeURIComponent(pass);
      xhr.open('post', '/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    xhr.responseType = 'json';
    xhr.onload = function() {
      console.log("this xhr =",this);
     if (this.status == 200) {
         cb({
        authenticated: true,
        token: this.response.token
     //   token: Math.random().toString(36).substring(7)
      });
      } else {
        
    cb({ authenticated: false });
      }
      
   };
  xhr.send(user);
    
  }