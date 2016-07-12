import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import App from "./components/App.jsx";
import  Login  from "./components/Login.jsx";
import Signup from "./components/Signup.jsx"
import Dashboard from "./components/Dashboard.jsx"
import Settings from "./components/Settings.jsx"
import BooksGridLayout from "./components/BooksGridLayout.jsx"
import * as auth from "./auth/clientAuth.js";

var socket=io();

auth.logout()

  function requireAuth(nextState, replace) {
      if (!auth.loggedIn()) {
        replace({
          pathname: '/login',
          state: { nextPathname: nextState.location.pathname }
        })
      }
    }

         
    ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={App}>
               <IndexRoute component={Login}></IndexRoute>
               <Route path="signup" name="signup" component={Signup}></Route>
               <Route path="login" name="login" component={Login}></Route>
               <Route path="allBooks" name="allBook" component={BooksGridLayout}></Route>
               <Route path="settings" name="settings" component={Settings}></Route>
               <Route path="dashboard" name="dashboard" component={Dashboard} onEnter={requireAuth}></Route>
            </Route>
        </Router>
        
        ), document.getElementById("app"));    
