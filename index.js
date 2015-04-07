var express = require("express")
var bodyParser = require("body-parser")
var cookieParser = require("cookie-parser")

var app = express()


var t411 = require("./t411-handler.js")

var Users = require("./ressources/users.js")
var Torrents = require("./ressources/torrents.js")



//Express initialization
app.set('trust proxy', 1) // trust first proxy
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))// parse application/x-www-form-urlencoded
app.use(bodyParser.json())// parse application/json
exports.app = app
var authentication = require('./authentication.js')

//Middleware - Loggin each request with timestamp + path
app.use(function (req, res, next) {
	var d = new Date();
	var strDate = d.toLocaleString();
	strDate = strDate.substr(0,strDate.indexOf('GMT'))
  	console.log(strDate+"- "+req.method+" : "+req.url);
 	next();
});


app.get("/", function (req, res){
	var options = {
	    root: __dirname + '/default_app/',
	    dotfiles: 'deny',
	    headers: {
	        'x-timestamp': Date.now(),
	        'x-sent': true
	    }
	}
	if(req.user){
		options.root = __dirname + '/app/'
	}
	res.sendFile("index.html", options, function (err) {
	    if (err) {
		    console.log(err);
		    res.status(err.status).end();
	    }
	})
})

app.use('/api', function (req, res, next){
	if(req.user){
		next()
	}
	else{
		res.status(401).send({msg : "You have to sign in."})
	}
},Torrents.router, Users.router)

//Start server
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Nox Node Server - START ! - HOST : http://%s:%s', host, port)

})