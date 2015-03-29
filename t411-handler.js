var request = require("request")


var t411url = "https://api.t411.me"
var userToken = null

var getUserToken = function(username, password, callback){
  var postData = {
    "username" : username,
    "password" : password
  }
  request.post({url: (t411url+'/auth'), form: postData}, function(err,httpResponse,body){ 
    var jsonBody = JSON.parse(body)
    if(jsonBody.hasOwnProperty("token")){
      callback(jsonBody["token"])
    }
    else{
      callback(null)
    }
  })
}


exports.connectUser = function(username, password, callback){
  getUserToken(username, password, function(token){
    if(token){
      console.log("Authenticated !")
      userToken = token
      !!callback && callback()
    }
    else{
      console.log("Bad username / password !")
      !!callback && callback()
    }
  })
}

var isConnected = function(){
  return userToken? true:false
}
exports.isConnected = isConnected

exports.getTorrents = function(searchParams, callback){
  var url = t411url+
            '/torrents/search/'+
            (!!searchParams && searchParams.query?searchParams.query:'')+
            (!!searchParams && searchParams.cid?"&cid="+searchParams.cid:'')+
            (!!searchParams && searchParams.limit?"&limit="+searchParams.limit:"&limit=100")+
            (!!searchParams && searchParams.offset?"&offset="+searchParams.offset:'')
  request.get({url: url, headers: {'Authorization':userToken}}, function(err,httpResponse,body){ 
    if(err){
      !!callback && callback(null)
    }
    else{
      var bodyLines   = body.split('\n')
      var reqResult   = JSON.parse((bodyLines.length>0)?bodyLines[3]:bodyLines[0])
      var torrents = reqResult.torrents?reqResult.torrents:[]
      var processedTorrents = []
      torrents.forEach(function(elt){
        if(isNaN(elt)){
          processedTorrents.push(elt)
        }
      })
      callback(processedTorrents)
    }   
  })       
}

exports.getAllCID = function(callback){
  var cids = [];
  if(userToken){
    request.get({url: (t411url+'/categories/tree'), headers: {'Authorization':userToken}}, function(err,httpResponse,body){
      var jsonBody = JSON.parse(body)
      for(var pid in jsonBody){
        if(jsonBody[pid].hasOwnProperty("cats")){
          for(var cid in jsonBody[pid].cats){
            cids.push(cid)
          }
        }
      }
      callback && callback(cids)
    })
  }
  else{
    console.log("No user connected !")
    !!callback && callback(null)
  }
}