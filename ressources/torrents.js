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
	connection.query(query, createTorrent(torrent), function(err, rows, fields) {
	  if (err){
	  	throw err;
	  	!!callback && callback(false)
	  } 
	  else{
	  	!!callback && callback(true)
	  }
	});
}
exports.insertTorrent = insertTorrent

var updateTorrent = function(torrent, callback){

}

var deleteTorrent = function(id){

}

var deleteCategory = function(CID, callback){
	if(CID){
		var query = 'DELETE FROM Torrents WHERE category=?'
		connection.query(query, [CID], function(err, rows, fields) {
		  if (err){
		  	throw err;
		  	!!callback && callback(false)
		  } 
		  else{
		  	!!callback && callback(true)
		  }
		});
	}
	else{
		!!callback && callback(false)
	}
}
exports.deleteCategory = deleteCategory

var deleteAllTorrents = function(callback){
	var query = 'TRUNCATE TABLE Torrents'
	connection.query(query, function(err, rows, fields) {
	  if (err){
	  	throw err;
	  	!!callback && callback(false)
	  } 
	  else{
	  	!!callback && callback(true)
	  }
	});
}
exports.deleteAllTorrents = deleteAllTorrents

var getLastInsertedId = function(callback){
	var query = 'SELECT MAX(id) FROM Torrents'
	connection.query(query, function(err, rows, fields){
		if (err){
		  	throw err;
		  	!!callback && callback(-1)
		} 
		else{
			!!callback && callback(rows[0]["MAX(id)"])
		}
	})
}
exports.getLastInsertedId = getLastInsertedId

var getNbTorrents = function(callback){
	var query = 'SELECT COUNT(*) FROM Torrents'
	connection.query(query, function(err, rows, fields){
		if (err){
		  	throw err;
		  	!!callback && callback(-1)
		} 
		else{
			!!callback && callback(rows[0]["COUNT(*)"])
		}
	})
}
exports.getNbTorrents = getNbTorrents

var getNbTorrentsByCid = function(CID, callback){
	if(CID){
		var query = 'SELECT COUNT(*) FROM Torrents WHERE category=?'
		connection.query(query, [CID], function(err, rows, fields){
			if (err){
			  	throw err;
			  	!!callback && callback(-1)
			} 
			else{
				!!callback && callback(rows[0]["COUNT(*)"])
			}
		})
	}
	else{
		!!callback && callback(-1)
	}
}
exports.getNbTorrentsByCid = getNbTorrentsByCid




router.route('/torrents')
	.get(function (req, res){
		var limit = 50
		var offset = 0
		if(req.query.hasOwnProperty("limit")){
			limit = req.query.limit
		}
		if(req.query.hasOwnProperty("offset")){
			offset = req.query.offset
		}
		var query = 'SELECT * FROM Torrents ORDER BY id DESC LIMIT '+limit+' OFFSET '+offset
		connection.query(query, function(err, rows, fields) {
		  if (err) throw err;
		  res.json(rows)
		});
	})
	.post(function (req, res){
		insertTorrent(req.body, function(ok){
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