/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// master data

var querystring = require('querystring');

var data = {
  results: []
};

for (var i = 0; i < 1; i++) {
  var temp = {
    username: 'Mel Brooks',
    text: ('This is my ' + i + ' message.'),
    roomname: 'lobby',
    objectId: Math.round((Math.random() * 50000))
  };
  data.results.push(temp);
}



var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'content-type': 'application/json',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  
 
  
  
  console.log('Serving request type ' + request.method + ' for ' + request.url);
  
  var headers = defaultCorsHeaders;
  
  if (request.method === 'GET') {
    if (request.url !== '/classes/messages') {
      response.writeHead(404, headers); 
      console.log('the request URL for this GET request is: ', request.url);
      response.end('invalid URL');
    } else {
      response.writeHead(200, headers);
      console.log('the request URL for this GET request is: ', request.url);
      response.end(JSON.stringify(data)); 
    }
  }
  
  if (request.method === 'POST' && request.url === '/classes/messages') {
    
    // console.log('the request URL for this POST request is: ', request.url);
    let body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    });
    
    request.on('end', () => {
      body = Buffer.concat(body).toString();
      // console.log('body = ', body);
      var newMessage = querystring.parse(body);
      newMessage.objectId = newMessage.objectId || (Math.random() * 50000);
      console.log('newMessage = ', newMessage);
      data.results.push(newMessage);
      // console.log('data is now this: ', data);
      response.writeHead(201, headers);
      // console.log(response);
      response.end(JSON.stringify(newMessage));
    });
  } else {
    response.writeHead(404, headers);
  }
  
  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  }



  // See the note below about CORS headers.
  

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.

  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


module.exports.requestHandler = requestHandler;

