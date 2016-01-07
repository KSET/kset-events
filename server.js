var http = require("http");
var https= require("https");
var url = require("url");
var fs = require("fs");
var process = require("process");

var fullURL = "https://www.kset.org";

var options = {
    host : "www.kset.org",
    path : "/feeds/rss/"
};

function land(response) {
    response.writeHead(200, { "Content-Type" : "text/html",
                              "Access-Control-Allow-Origin" : '*' });
    fs.createReadStream("index.html").pipe(response);
}

function fetch(response, link) {
    options.path = link;

    console.log(link);

    https.get(options, function(res) {
        res.on("data", function(chunk) {
            response.write(chunk.toString());
        });

        res.on("end", function() {
            response.end();
        });
    });
}

function askFor(reqData, response) {
    response.writeHead(200, { "Content-Type" : "text/xml",
                              "Access-Control-Allow-Origin" : '*' });
    if("site" in reqData.query) {
        var link = reqData.query["site"];
        
        if(link.lastIndexOf(fullURL, 0) === 0) {
            fetch(response, link.slice(fullURL.length));
        } else {
            response.write("Illegal request!");
            response.end();
        }
    } else {
        response.write("Invalid token.");
        response.end();
    }
}

function report(response) {
    response.writeHead(404, { "Content-Type" : "text/plain" });
    response.write("Error 404: page content not found");
    response.end();
}

function route(reqData, response) {
    if (reqData.pathname === "/") {
        console.log("Request for landing page");
        land(response);
    } else if(reqData.pathname === "/style.css") {
        console.log("Request for fetching CSS");
        response.writeHead(200);
        fs.createReadStream("./style.css").pipe(response);
    } else if (reqData.pathname === "/fetch") {
        console.log("Request for fetching HTML from a remote server");
        askFor(reqData, response);
    } else if (reqData.pathname === "/scripts/main.js") {
        console.log("Serving up the script");
        response.writeHead(200);
        fs.createReadStream("./scripts/main.js").pipe(response);
    } else {
        console.log("Invalid request for: " + reqData.pathname);
        report(response);
    }
}

var server = http.createServer(function(request, response) {
    route(url.parse(request.url, true), response);
});

server.listen(8080);
