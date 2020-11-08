'use strict';
const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./utils/pass')
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};

app.use(cookieParser())
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 24 * 1000}
}))


app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}))

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/setCookie/:clr', (req, res) => {
  res.cookie('color', req.params.clr, {httpOnly: true}).send('something');
});

app.get('/readCookie', (req, res) => {
  res.send('cookie read')
});

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('color')
  res.send('cookie deleted');
});

app.get('/form', (req, res) => {
  res.render('form')
})

app.get('/secret', loggedIn ,(req, res) => {
  res.render('secret')
})

app.get('/more', loggedIn ,(req, res) => {
  res.send('more secure pages')
})

app.post('/login', passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
      console.log('success');
      res.redirect('/secret');
    });

app.get('/logout', (req, res) => {

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
