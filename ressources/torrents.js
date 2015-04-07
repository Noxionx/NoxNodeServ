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

var findAllTorrents = function(options, callback){
	/*  options = {
			query : "string", 
			cid : number | [number],
			limit : number, (default : 50)
			offset : number, (default : 0)
			sort : "string", (default : id)
			order : "asc" | "desc" (default : desc)
		}
	*/
	var cols_ordered = ["id","rewritename","seeders","leechers","added","size","times_completed"]
	if(options.cid){
		if(typeof options.cid=="string"){
			if(options.cid.match(/\[(\s*\d*\s*)(,\s*\d*\s*)*\]/)){
				options.cid = JSON.parse(options.cid)
			}
		}
		else if(typeof options.cid=="number"){
			options.cid = [options.cid]
		}
		else{
			options.cid = undefined
		}
	}
	if(options.query && options.query.length>2){
		var tmpStr = options.query.toLowerCase()
		options.query = tmpStr.replace(" ","-")
	}
	var col_ordered = "id"
	if(options.sort){
		cols_ordered.forEach(function(elt){
			if(options.sort.match(elt)){
				col_ordered = elt
			}
		})
	}
	var direction = "DESC"
	if(options.order){
		if(options.order.toLowerCase().match("asc")){
			direction = "ASC"
		}
	}
	var query = 'SELECT * FROM Torrents'+
				(options.query?" WHERE rewritename LIKE "+connection.escape('%'+options.query+'%'):"")+
				(options.cid?((options.query?" AND":" WHERE")+" category IN ("+connection.escape(options.cid)+")"):"")+
				' ORDER BY '+col_ordered+' '+direction+' LIMIT '+connection.escape(options.limit?parseInt(options.limit) : 50)+' OFFSET '+connection.escape(options.offset|| 0)
	connection.query(query, function(err, rows, fields) {
	  if (err) throw err;
	  !!callback && callback(rows)
	});
}
var findTorrentById = function(id, callback){
	var query = 'SELECT * FROM Torrents WHERE id=?'
	var num_id = parseInt(id)
	if(id!=NaN){
		connection.query(query, [num_id], function(err, rows, fields){
			if(err) throw err;
			!!callback && callback(rows)
		})
	}
	else{
		!!callback && callback(null)
	}
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
		findAllTorrents(req.query, function(data){
			if(!!data)
				res.json(data)
			else
				res.status(500).send()
		})
		
	})
	.post(function (req, res){
		insertTorrent(req.body, function(ok){
			if(ok)
				res.status(201).send()
			else
				res.status(500).send()
		})
	})

router.route('/torrents/:id')
	.get(function (req, res){
		findTorrentById(req.params.id, function(data){
			if(!data){
				res.status(404).send()
			}
			else{
				res.json(data)
			}
		})
	})
	.put(function (req, res){
		res.status(501).send("Not implemented")
	})
	.delete(function (req, res){
		res.status(501).send("Not implemented")
	})

exports.router = router