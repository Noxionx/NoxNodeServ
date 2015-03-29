var express = require("express")
var router = express.Router();
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Warcraft35400!',
  database : 't411db'
});

var torrent_model = {
    "id": 0,
    "name": null,
    "category": null,
    "rewritename": null,
    "seeders": null,
    "leechers": null,
    "comments": null,
    "added": null,
    "size": null,
    "times_completed": null,
    "owner": null,
    "categoryname": null,
    "username": null
}

var createTorrent = function(torrent){
	var repTorrent = {}
	for(var key in torrent_model){
		repTorrent[key] = torrent[key]? torrent[key] : null
	}
	return repTorrent
}
var insertTorrent = function(torrent, callback){
	var query = 'INSERT INTO Torrents SET ?'
	connection.query(query, torrent, function(err, rows, fields) {
	  if (err){
	  	throw err;
	  	!!callback && callback(false)
	  } 
	  !!callback && callback(true)
	});
}

router.route('/torrents')
	.get(function (req, res){
		var query = 'SELECT * FROM Torrents'
		connection.query(query, function(err, rows, fields) {
		  if (err) throw err;
		  res.json(rows)
		});
	})
	.post(function (req, res){
		var torrent = createTorrent(req.body)
		insertTorrent(torrent, function(ok){
			if(ok){
				res.status(201).send()
			}
			else{
				res.status(500).send()
			}
		})
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