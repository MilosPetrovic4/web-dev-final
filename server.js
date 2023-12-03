var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('database/chess_db');


const express = require('express')
const bodyParser = require('body-parser');
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
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', render.login)
app.get('/register', render.register)
app.get('/home', render.home);
app.post('/submit', function(req, res){

    const username = req.body.InputNAME;
    const password = req.body.InputPSW;

    console.log(username)
    console.log(password)
})

app.post('/checkDB', function (req, res) {

    var authorized = false
    //check database users table for user
    db.all("SELECT username, password, access FROM users", function(err, rows) {

        

      for (var i = 0; i < rows.length; i++) {
        if (rows[i].username == req.body.id & rows[i].password == req.body.psw) {
          authorized = true
          user_role = rows[i].role;
        }

        
        console.log(req.body.id)
        console.log(req.body.psw)
      }
    })

    console.log(authorized)
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