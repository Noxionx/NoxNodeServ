var express = require("express")
var passport = require("passport")
var bodyParser = require("body-parser")
var cookieParser = require("cookie-parser")
var session = require('express-session')
var app = express()
var t411 = require("./t411-handler.js")

var torrents = require("./ressources/torrents.js")




//Express initialization
app.set('trust proxy', 1) // trust first proxy
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))// parse application/x-www-form-urlencoded
app.use(bodyParser.json())// parse application/json
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', torrents.router)


//Middleware - Loggin each request with timestamp + path
app.use(function (req, res, next) {
	var d = new Date();
	var strDate = d.toLocaleString();
	strDate = strDate.substr(0,strDate.indexOf('GMT'))
  	console.log(strDate+"- "+req.method+" : "+req.url);
 	next();
});

//Route for login in - CREDENTIALS : {"username":username, "password":password}
app.post('/login', function (req, res) {
	if(!req.body.username||!req.body.password){
		res.status(400).send({msg:"Missing parameters"})
	}
	else{
		t411.connectUser(req.body.username, req.body.password, function(){
			res.send({msg:"Authenticated !"})
		})
	}
})




var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Nox Node Server - START ! - HOST : http://%s:%s', host, port)

})