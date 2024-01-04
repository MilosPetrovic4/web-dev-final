var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('database/chess_db');

const express = require('express')
const bodyParser = require('body-parser');
var http = require('http');
const app = express() 
var path = require('path');
const PORT = process.env.PORT || 3000
const ROOT_DIR = '/views' //root directory for our static pages
const axios = require('axios');
const session = require('express-session');


//express session
app.use(session({
  secret: 'secretkey', 
  resave: false,
  saveUninitialized: true,
}));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //use hbs handlebars wrapper
app.use(express.static(path.join(__dirname, 'styles')));

app.locals.pretty = true;
var render = require('./routes/render');

app.use(bodyParser.json());

app.get('/logout', render.logout)
app.get('/login', render.login)
app.get('/register', render.register)
app.get('/users', render.users)
app.get('/home', render.home)
app.get('/play', render.play)
app.get('/create', render.create)
app.post('/checkDB', render.checkDB)
app.post('/registerUser', render.registerUser)
app.post('/questionAnswered', render.questionAnswered) 
app.post('/insertData', render.insertData)
app.post('/submit', function(req, res){
    const username = req.body.InputNAME;
    const password = req.body.InputPSW;
})

app.listen(PORT, err => {
    if(err) console.log(err)
    else {
          console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
          console.log(`To Test:`)
          console.log('http://localhost:3000/home')
          console.log('http://localhost:3000/users')
      }
  })