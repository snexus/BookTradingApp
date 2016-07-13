#Book Trading Application

## General information

Book trading application is a platform to explore, manage, catalogue and borrow books.  Advanced dashboard with on-hover context menus allows user to add books via google books search engine, delete books from the collection, to allow/decline/delete book requests from other users and to receive real-time messages from application. "All books" page shows a total book pool with filtering capabilites and on-hover context menu.

Application url - https://book-trade-app.herokuapp.com

Demo accounts: test/test, test2/test2
For exploring real-time capabilities, open in two browsers with different credentials.


## Technology stack used:
- Customized bootstrap material design library
- Authentication - json web tocken, bcrypt hashed password storing for maximum security
- React.js/Flux as front-end
- Responsive design with Bbootstrap/HTML5/CSS3
- LESS for CSS preprocessing
- Node.js/Express.js/MongoDB as back-end
- Socket.io for real time messaging

## Running the server

$ node server.js
