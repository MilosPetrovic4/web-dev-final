
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('database/chess_db');
const axios = require('axios');


authorized = false

exports.authenticate = function (request, response, next, username) {

    response.render('authentication', 
    { title: 'Chess Trivia', body: 'log in page', buttonText: 'Log In', buttonText2: 'Register'});

}

exports.login = function (request, response) {
    response.render('login', { title: 'LOGIN', body: 'credentials:', buttonText: 'Log In'});
}

exports.register = function (request, response) {
    response.render('register', { title: 'REGISTER', body: 'credentials:', buttonText: 'Register'});
}

exports.checkDB = function(req, res) {

  var authorized = false
  //check database users table for user
  db.all("SELECT username, password, access FROM users", function(err, rows) {
    for (var i = 0; i < rows.length; i++) {
      console.log(rows[i].username)

      if (rows[i].username.localeCompare(req.body.name) == 0 & rows[i].password.localeCompare(req.body.password) == 0) {
        authorized = true;
        user_role = rows[i].access;
        break
      }
    }

    if (authorized) {
      req.session.user = {
        username: req.body.name,
        role: user_role, // Assuming user_role contains the role retrieved from the database
      };
      req.session.authenticated = true
      let link = '/home';

      console.log(req.session.user)
      res.send(link);
     
    } else {
      console.log("Not valid username")
    }

  })
}

exports.registerUser = function(req, res) {

    var newUserQuery = `INSERT INTO users (username, password, access, correct, incorrect) VALUES (?, ?, ?, ?, ?)`;

  db.run(newUserQuery, [req.body.name, req.body.password, "guest", 0, 0], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to register user' });
    } else {
      
      req.session.user = {
        username: req.body.name,
        role: 'guest' // Assuming user_role contains the role retrieved from the database
      };

      let link = '/home';
      res.send(link);
    }
  });
} 

exports.home = function (request, response) {

    if (!request.session.authenticated) {
      response.render('authentication', { title: 'Chess Trivia', body: 'log in page', buttonText: 'Log In', buttonText2: 'Register'});
    } else {
      response.render('home', { title: 'Chess Trivia', body: 'Put your knowledge of the royal game to the test', buttonText: 'Play', insertButton: 'create question', logoutButton: 'log out'});
    }
}

exports.create = function (request, response) {
  if (!request.session.authenticated) {
    response.render('authentication', { title: 'Chess Trivia', body: 'log in page', buttonText: 'Log In', buttonText2: 'Register'});
  } else {
    response.render('create', { title: 'Chess Trivia', body: 'create your very own questions', insertButton: 'create question', backButton: 'home'});
  }
}

exports.users = function (request, response) {

    if (request.session.authenticated && request.session.user.role === 'admin') {

      db.all("SELECT username, password, access, correct, incorrect FROM users", function(err, rows) {

        response.render('users', {
            title: 'Users',
            users: rows // Pass the fetched user data to the view
        });
      })  
    } else {
      response.status(403).send('Forbidden: Access denied')
    }
}

exports.questionAnswered = function (req, res) {

  if (req.session.authenticated) {
    const isCorrect = req.body.value;
    const username = req.session.user ? req.session.user.username : null;

      if (isCorrect) {
        db.run(`UPDATE users SET correct = correct + 1 WHERE username = ?`, [username], function(err) {
          if (err) {
            console.error(err);
            res.status(500).send('Error');
          } else {
            console.log('updated successfully');
            res.status(200).send('Correct answers updated successfully');
          }
        })
      } else {
        db.run(`UPDATE users SET incorrect = incorrect + 1 WHERE username = ?`, [username], function(err) {
          if (err) {
            console.error(err);
            res.status(500).send('Error');
          } else {
            console.log('updated successfully');
            res.status(200).send('incorrect answers updated successfully');
          }
        })

      }
  } else {
    response.render('authentication', { title: 'Chess Trivia', body: 'log in page', buttonText: 'Log In', buttonText2: 'Register'});
  }
}

exports.insertData = function (req, res) {

  if (request.session.authenticated) {

    const question = req.body.question;
    const correct = req.body.correct;
    const option2 = req.body.option2;
    const option3 = req.body.option3;
    const option4 = req.body.option4;

    var apiurl = "http://localhost:4000/insert"

    apidata = {
      question: question,
      correct: correct,
      option2: option2,
      option3: option3,
      option4: option4
    };

    axios.post(apiurl, apidata)
      .then(apiResponse => {
        // Handle the response from your API server if needed
        console.log('Data sent successfully');
        res.status(200).send('Data sent successfully');
      })
      .catch(apiError => {
        console.error('Error sending data:', apiError);
        res.status(500).send('Error sending data');
      });

  } else {
    response.render('authentication', { title: 'Chess Trivia', body: 'log in page', buttonText: 'Log In', buttonText2: 'Register'});
  }
}

exports.play = function (request, response) {

    if (request.session.authenticated) {
      var url = "http://localhost:4000/question"

      axios.get(url) //make api request using axios
          .then(responseQuestion => {

              var apidata = responseQuestion.data
              var temp
              
              //used to randomize the order of the options
              var shuffleArray = [apidata.correct, apidata.option2, apidata.option3, apidata.option4]

              //shuffles the array
              for (let i = 0; i < shuffleArray.length; i ++) {
                  j = Math.floor(Math.random() * shuffleArray.length + 1) - 1;
                  temp = shuffleArray[j]
                  shuffleArray[j] = shuffleArray[i]
                  shuffleArray[i] = temp
              }

              //renders next page
              response.render('play', { 
              title: 'Chess Trivia', 
              question: apidata.question, 
              option1: shuffleArray[0], 
              option2: shuffleArray[1], 
              option3: shuffleArray[2], 
              option4: shuffleArray[3],
              backtext: "home",
              correct: apidata.correct
          });
          }) 
        } else {
          response.render('authentication', { title: 'Chess Trivia', body: 'log in page', buttonText: 'Log In', buttonText2: 'Register'})
        }
} 

exports.logout = function(req, res) {

  console.log("logged out...")

  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Error logging out');
    }
    res.sendStatus(200); // Sending a success status

  });
}

    