var server = require('./index.js')
var app = server.app
var passport = require("passport")
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash')
var session = require('express-session')
var RedisStore = require('connect-redis')(session)
var redis = require("redis")
var redis_client = redis.createClient()

var Users = require("./ressources/users.js")

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  store: new RedisStore({
  	client: redis_client
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


passport.use(new LocalStrategy(
  function(username, password, done) {
    Users.findUser(username, function (err, user) {
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      if (!Users.validPassword(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' })
      }
      return done(null, user)
    })
  }
))
passport.serializeUser(function(user, done) {
  done(null, user.username)
})

passport.deserializeUser(function(username, done) {
  Users.findUser(username, function(err, user) {
    done(err, user)
  })
})

//Route for login in - CREDENTIALS : {"username":username, "password":password}
app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   				failureRedirect: '/login',
                                   				failureFlash: true }))
app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})