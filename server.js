// Get dependencies
const express = require('express');
const expressSession = require('express-session')
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Authentication middleware
app.use(expressSession({ secret: 'thisIsASecret', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
 
passport.use(new LocalStrategy(function(username, password, done) {
    if ((username === "john") && (password === "password")) {
      return done(null, { username: username, id: 1 });
    } else {
      return done(null, false);
    }
}));

// Catch all other routes and return the index file

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/Login.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const port = process.env.PORT || '8000';
app.set('port', port);
 

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?err',
  }));

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));