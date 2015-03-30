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

exports.getTorrentsCount = function(cid, callback){
  if(!cid){
    !!callback && callback(0)
  }
  else{
    var url = t411url+
            '/torrents/search/'+
            "&cid="+cid+
            "&limit=1"
    request.get({url: url, headers: {'Authorization':userToken}}, function(err,httpResponse,body){ 
      if(err){
        !!callback && callback(0)
      }
      else{
        var bodyLines   = body.split('\n')
        var reqResult   = JSON.parse((bodyLines.length>0)?bodyLines[3]:bodyLines[0])
        var nbTorrents  = reqResult.total?parseInt(reqResult.total):0;
        !!callback && callback(nbTorrents)
      }
    })
  }
}

exports.getTorrents = function(searchParams, callback){
  if(!isConnected()){
    !!callback && callback(null)
  }
  else{
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
        var processedTorrents = []
        var bodyLines   = body.split('\n')
        var strResult = (bodyLines.length>0)?bodyLines[3]:bodyLines[0]
        if(!(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(strResult.replace(/"(\\.|[^"\\])*"/g,'')))){
          var reqResult   = JSON.parse(strResult)
          var torrents = reqResult.torrents?reqResult.torrents:[]
          torrents.forEach(function(elt){
            if(isNaN(elt)){
              processedTorrents.push(elt)
            }
          })
          !!callback && callback(processedTorrents)
        }
        else{
          console.log("non valid rep")
          !!callback && callback(processedTorrents)
        }   
      }   
    }) 
  }
        
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