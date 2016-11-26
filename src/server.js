var http = require('http');
var url = require('url');
var query = require('querystring');
var fs = require('fs');
var blizzard = require('blizzard.js').initialize({ apikey: "refzaa75bjg4wmp59p2x9uza52h8n8vw" });

var index = fs.readFileSync(__dirname + "/../client/index.html");

var port = process.env.PORT || 3000;

function onRequest(req, res) {
  var parsedUrl = url.parse(req.url);
  var params = query.parse(parsedUrl.query);
  
  console.dir(parsedUrl.pathname)
  
  if(parsedUrl.pathname === "/wowChar") {
    wowCharSearch(req, res, params);
  }
  else if(parsedUrl.pathname === "/wowGuild") {
    wowGuildSearch(req, res, params);
  }
  else {
    res.writeHead(200, { "Content-Type" : "text/html"} );
    res.write(index);
    res.end();
  }
}

function wowCharSearch(req, res, params) {
  var character = {
    realm: params.realm, 
    name: params.character, 
    origin: 'us'
  };
  
  var search = blizzard.wow.character(['profile', 'achievements'], character);
  
  search.then(function (response) {
    res.write(JSON.stringify(response.data));
    res.end();
  });
  
  search.catch(function (err) {
    console.error(err);
    
    var responseMessage = {
      error: "Could not find realm or character"
    }
    res.write(JSON.stringify(responseMessage));
    res.end();
  }); 
}

function wowGuildSearch(req, res, params) {
  console.dir(params);
  
  var guild = {
    realm: params.realm, 
    name: params.guild, 
    origin: 'us'
  };
  
  var search = blizzard.wow.guild(['profile', 'members'], guild)
  
  search.then(function (response) {
    res.write(JSON.stringify(response.data));
    res.end();
  });
  
  search.catch(function (err) {
    console.error(err);
    
    var responseMessage = {
      error: "Could not find realm or guild"
    }
    res.write(JSON.stringify(responseMessage));
    res.end();
  }); 
}

http.createServer(onRequest).listen(port);
console.log("listening on port " + port);