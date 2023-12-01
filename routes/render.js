
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('database/chess_db');

var onAuthPage = true;

exports.authenticate = function (request, response, next) {
    
    if (onAuthPage) {
        console.log("AUTHENTICATING...")
        onAuthPage = false
        response.render('authentication', 
        { title: 'CHESS WORLD', body: 'log in page', buttonText: 'Log In', buttonText2: 'Register'});
    } else {
        console.log("Go to the desired page")    
        next()
    }

}

exports.login = function (request, response) {
    response.render('login', { title: 'LOGIN', body: 'credentials:', buttonText: 'Log In'});
}

exports.register = function (request, response) {
    response.render('register', { title: 'REGISTER', body: 'credentials:', buttonText: 'Register'});
}

exports.home = function (request, response) {
    response.render('index', { title: 'COMP 2406', body: 'rendered with handlebars'});
}