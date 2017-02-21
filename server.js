var url = require('url')
var http = require('http')
var fs = require('fs')
var port = process.argv[2];

function jsontime(req) {
    var res = {}
    var date = ''
    var months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]

    //decode path
    req = decodeURI(req);

    //check if input was a unix timestamp (number)
    if(!isNaN(req)) {
        date = new Date(req * 1000);  //convert seconds to micro seconds
        unix = Date.parse(date) / 1000;
        natural = months[date.getMonth()] + ' ' + String(date.getDate())+ ', ' + String(date.getFullYear());  // generate natural time string
    } else {
        natural = req;  //natural time string provided
        unix = Date.parse(natural) / 1000;  //convert to unix timestamp
        console.log(unix)
    }

    //check that the natural representation is valid and set values to response
    if(new Date(natural) == 'Invalid Date') { //implicitly states that unix representation was also correct
        res.unix = null;
        res.natural = null;
    } else {
        res.unix = unix;
        res.natural = natural;
    }
    return res
}

var server = http.createServer(function(req, res) {
    //parse incoming request for date time parameter endpoint
    var path = url.parse(req.url, true).pathname
    console.log('path: ' + path)
    //if path is / serve html
    if(path == '/') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var fileStream = fs.createReadStream('index.html');
        fileStream.pipe(res);
    } else {

        //remove leading slash to extract the req parameter
        query = path.replace('/', '')

        //convert date and return dict
        var json = jsontime(query)

        console.log(json)
        res.write(JSON.stringify(json))
        res.end()
    }
})

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('Example app listening on port 3000')
})
