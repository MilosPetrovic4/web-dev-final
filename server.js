
const express = require('express')
//const logger = require('morgan')
var http = require('http');
const app = express() 
var path = require('path');
const PORT = process.env.PORT || 3000
const ROOT_DIR = '/views' //root directory for our static pages




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //use hbs handlebars wrapper

app.locals.pretty = true;

var render = require('./routes/render');


app.use(render.authenticate)

//app.use(logger('dev'))

// app.get('/login', function(req, res) {
//     render.login;
// });

app.get('/login', render.login)

app.get('/register', render.register)
    
app.get('/home', render.home);

app.listen(PORT, err => {
    if(err) console.log(err)
    else {
          console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
          console.log(`To Test:`)
          console.log('http://localhost:3000/home')
          console.log('http://localhost:3000/users')
      }
  })