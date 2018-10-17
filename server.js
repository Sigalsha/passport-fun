// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session')
const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Authentication middleware
app.use(expressSession({ secret: 'thisIsASecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  
    next()
})

passport.serializeUser(function (user, done) {
    console.log(user);
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
// Point static path to dist
passport.use(new LocalStrategy(function (username, password, done) {
    if ((username === "john") && (password === "password")) {
        return done(null, { username: username, id: 1 });
    } else {
        return done(null, false, "Failed to login.");
    }
}));

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?err',
}));

// Catch all other routes and return the index file

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/Login.html'));
});

app.get('/logout', function (req, res) {
    req.logout();
    res.send('Logged out!');
});

function authOnly(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/', authOnly, function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user);
    } else {
        res.redirect('/login')
    }
})

app.get('/userDetails', authOnly, function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user);
    } else {
        res.redirect('/login');
    }
});

app.get('/username', authOnly, function (req, res) {
    // let {username} = req.params;
    if (req.isAuthenticated()) {
        res.send(req.user.username);
    } else {
        res.redirect('/login');
    }
})

// Point static path to dist
app.use(authOnly, express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file
app.get('*', authOnly, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Catch all other routes and return the index file
app.use((err, req, res, next) => {
    res.status(500).send(err);
});

const port = process.env.PORT || '8000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));