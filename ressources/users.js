var express = require("express")
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Warcraft35400!',
  database : 't411db'
});

var user_model = {
	"username":null,
	"password":null,
	"t411_username":null,
	"t411_password":null,
	"firstname":null,
	"lastname":null
}

exports.validPassword = function(givenPwd, userPwd){
	if(givenPwd.match(userPwd)){
		return true
	}
	return false
}

var createUser = function(user){
	var repUser = {}
	for(var key in user_model){
		repUser[key] = user[key]? user[key] : null
	}
	return repUser
}

var findUser = function(username, callback){
	var query = 'SELECT * FROM Users WHERE username=?'
	connection.query(query, [username], function(err, rows, fields){
		if(err){
			!!callback && callback(err)
		}
		else{
			!!callback && callback(null, rows[0])
		}
	})
}
exports.findUser = findUser

var insertUser = function(user, callback){
	var query = 'INSERT INTO Users SET ?'
	connection.query(query, createUser(user), function(err, rows, fields){
		if (err){
			!!callback && callback(err)
		} 
		else{
			!!callback && callback()
		}
	})
}
exports.insertUser = insertUser

var updateUser = function(user, callback){

}



router.route('/users/:username')
	.get(function (req, res){
		if(req.params.username){
			findUser(req.params.username, function(err, user){
				if(err){
					res.status(500).send(err)
				}
				else{
					if(user){	
						res.json(user)
					}
					else{
						res.status(404).send()
					}
				}
			})
		}
		else{
			res.status(400).send({msg:"Missing parameters."})
		}
	})
exports.router = router