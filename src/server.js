//built-in node module for running HTTP servers
var http = require('http');
//built-in node module for parsing URLs
var url = require('url');
//built-in node module to parsing query strings
//query strings are the key=value&key2=value2 pairs
//after the ? in a url
var query = require('querystring');
//built-in node module for accessing the file system
var fs = require('fs');
//downloaded module for accessing the anilist API
//https://github.com/sotojuan/nani
var nani = require('nani').init("api_id", "api_secret");

//read in our html file to serve back
var index = fs.readFileSync(__dirname + "/../client/index.html");

//set the port. The process.env.PORT variable will be filled in by
//server companies such as heroku or amazon.
//otherwise, we will fall back to 3000 on this machine
var port = process.env.PORT || 3000;

//function to handle our HTTP web requests
function onRequest(req, res) {
  //parse the URL from a string to an object of usable parts
  var parsedUrl = url.parse(req.url);
  //grab the query string from the parsedURL and parse it
  //into a usable object instead of a string
  var params = query.parse(parsedUrl.query);
  
  console.dir(parsedUrl.pathname)
  
  //if web page asked for /animeSearch (assuming ajax request)
  if(parsedUrl.pathname === "/animeSearch") {
    animeSearch(req, res, params);
  }
  //if web page asked for /character (assuming ajax request)
  else if(parsedUrl.pathname === "/character") {
    characterSearch(req, res, params);
  }
  //ALL other requests send back the main page
  else {
    //set 200 (okay) status for success
    //set content type for the html file to text/html
    res.writeHead(200, { "Content-Type" : "text/html"} );
    //write html file into the response
    res.write(index);
    //send response to client
    res.end();
  }
}

//function to do an anime search to the anilist API for us
function animeSearch(req, res, params) {
  /**
    URL structure according to anlist documentation
    {anime or manga}/search/searchTerm
    /anime/search/term
    /manga/search/term
    
    example:
    /anime/search/ghost
    /manga/search/ghost
  **/
  
  //use the nani api to call anime/search/ and then the search
  //term. This is from the API documentation.
  //On success this will call the .then function
  //On failure this will call the .catch function
  //we just chain the then and catch functions onto
  //the nani call
  nani.get('anime/search/' + params.term)
  .then(function(data) {
    //set status to 200 (okay) for success
    //set content-type to application/json since
    //we will send back json. We are assuming this
    //is an ajax request and they want json back
    res.writeHead(200, { "Content-Type" : "application/json"});
    //on success write the data returned from the anilist
    //servers to our client response
    //We need to stringify the json to make it valid for HTTP
    res.write(JSON.stringify(data));
    //send response to client
    res.end();
  })
  .catch(function(err) {
    console.dir(err);
    //set status to 400 (client error) for error
    //we could be more accurate and choose a more specific error code
    //depending on the error back from the API. 
    //set content-type to application/json since
    //we will send back json. We are assuming this
    //is an ajax request and they want json back    
    res.writeHead(400, { "Content-Type" : "application/json"});
    //on error, write the data returned from the anilist
    //servers to our client response
    //You could also handle it a different way in our
    //server code. This example just sends it back to the
    //client by stringifying the JSON from anilist
    //and adding it to our response.
    res.write(JSON.stringify(err));
    //send the response back to the client
    res.end();
  });
}

//function to do a character search to the anilist API for us
function characterSearch(req, res, params) {
   /**
    URL structure according to anilist documentation
    /character/search/term
  **/

  //use the nani api to call character/search/ and then the search
  //term. This is from the API documentation.
  //On success this will call the .then function
  //On failure this will call the .catch function
  //we just chain the then and catch functions onto
  //the nani call
  nani.get('character/search/' + params.character)
  .then(function(data) {
    //set status to 200 (okay) for success
    //set content-type to application/json since
    //we will send back json. We are assuming this
    //is an ajax request and they want json back
    res.writeHead(200, { "Content-Type" : "application/json"});
    //on success write the data returned from the anilistgit push -u origin master
    //servers to our client response
    //We need to stringify the json to make it valid for HTTP
    res.write(JSON.stringify(data));
    //send the response back to the client
    res.end();
  })
  .catch(function(err) {
    console.dir(err);
    //set status to 400 (client error) for error
    //we could be more accurate and choose a more specific error code
    //depending on the error back from the API. 
    //set content-type to application/json since
    //we will send back json. We are assuming this
    //is an ajax request and they want json back    
    res.writeHead(400, { "Content-Type" : "application/json"});
    //on error, write the data returned from the anilist
    //servers to our client response
    //You could also handle it a different way in our
    //server code. This example just sends it back to the
    //client by stringifying the JSON from anilist
    //and adding it to our response.
    res.write(JSON.stringify(err));
    //send the response back to the client
    res.end();
  });
}

//start listening for web traffic
//all requests to go onRequest. 
//listening on the specified port
http.createServer(onRequest).listen(port);
console.log("listening on port " + port);