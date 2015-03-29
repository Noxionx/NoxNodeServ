var express = require("express")
var router = express.Router();
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Warcraft35400!',
  database : 't411db'
});

router.route('/torrents')
	.get(function (req, res){
		connection.connect();
		connection.query('SELECT * FROM Torrents', function(err, rows, fields) {
		  if (err) throw err;
		  res.json(rows)
		});
		connection.end();
	})
	.post(function (req, res){
		res.status(501).send("Not implemented")
	})

router.route('/torrents/:id')
	.get(function (req, res){
		res.status(501).send("Not implemented")
	})
	.put(function (req, res){
		res.status(501).send("Not implemented")
	})
	.delete(function (req, res){
		res.status(501).send("Not implemented")
	})

exports.router = router