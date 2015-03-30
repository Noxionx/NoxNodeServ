var t411 = require("./t411-handler.js")
var torrents = require('./ressources/torrents.js')
// var users = require("./ressources/users.js")

var fetchCID = function(CID, callback){
	torrents.deleteCategory(CID, function(ok){
		t411.getTorrentsCount(CID, function(nbTorrents){
			if(nbTorrents){
				var offset = 0
				var limit = 500
				var progress = 0
				while(offset<nbTorrents){
					t411.getTorrents({cid:CID, limit: limit, offset:offset}, function(data){
						var i = 0;
						if(data.length==0){
							progress+=((nbTorrents<limit)?100:((limit/nbTorrents)*100))
							console.log("Fetched CID "+CID+" : "+progress+" %")
							if(progress>=100){
								!!callback && callback()
							}
						}
						else{
							data.forEach(function(elt){
								torrents.insertTorrent(elt, function(){
									i++;
									if(i==data.length){
										progress+=((nbTorrents<limit)?100:((limit/nbTorrents)*100))
										console.log("Fetched CID "+CID+" : "+progress+" %")
										if(progress>=100){
											!!callback && callback()
										}
									}
								})
							})
						}
					})
					offset+=limit
				}
			}
			else{
				!!callback && callback()
			}
		})
	})
}
exports.fetchCID = fetchCID

var fetchAllCID = function(callback){
	torrents.deleteAllTorrents(function(){
		t411.getAllCID(function(cids){
			if(cids){
				console.log(cids)
				var busy = false
				var i = 0
				var timer = setInterval(function(){
					if(i==cids.length){
						clearTimeout(timer)
						callback()
					}
					else{
						if(!busy){
							console.log("Fetching CID : "+cids[i]+" - "+(i+1)+"/"+cids.length)
							busy = true;
							fetchCID(cids[i], function(){
								busy = false;
							})
							i++
						}
					}
				}, 1000)
			}
		})
	})
}
exports.fetchAllCID = fetchAllCID

var refreshTorrents = function(callback){
	torrents.getLastInsertedId(function(lastId){
		if(lastId){
			var done = false
			var limit = 100
			var offset = 0
			var timer = setInterval(function(){
				var busy = false
				if(done){
					clearTimeout(timer)
					!!callback && callback(data&&!busy)
				}
				if(!busy){
					busy = true
					t411.getTorrents({limit: limit, offset:offset}, function(data){
						if(!!data && data.length>0){
							var i=0
							data.forEach(function(elt){
								if(!!elt.id && lastId<parseInt(elt.id)){
									torrents.insertTorrent(elt, function(){
										console.log("inserted new torrent : "+elt.id)
										i++;
										if(i==data.length){
											busy = false	
										}
									})
								}
								else{
									done = true
								}
							})
						}
						else{
							done=true
						}
					})
				}

			}, 1000)
		}
		else{
			fetchAllCID(function(){
				!!callback && callback(true)
			})
		}
	})
}

exports.refreshTorrents = refreshTorrents

var ready = false
if(!t411.isConnected()){
	console.log("connexion ...")
	t411.connectUser("noxionx", "warcraft3",function(){
		ready = true
		refreshTorrents(function(){
			console.log("refreshed")
		})
	})
}
else{
	ready = true
}
exports.ready = ready
