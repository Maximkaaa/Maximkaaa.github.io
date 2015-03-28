var http = require('http');
var bot = require('./nodeDummy.js');

http.createServer(function (req, res) {
    var body = '';
    req.on('data', function(chunk) {
        body += chunk;
    });

    req.on('end', function() {
        res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});

        var data;
        try {
            data = JSON.parse(body);
        } catch (e) {
            console.log('Could not parse the request: ' + body);
        }

        if (data) {
            var response = [];
            for (var i = 0; i < data.length; i++) {

                for (var j = 0; j < contexts.length; j++) {
                    if (contexts[j].id === data[i].id) {

                        for (var key in contexts[j]) {
                            if (contexts[j].hasOwnProperty(key) && data[i][key] === undefined) {
                                data[i][key] = contexts[j][key];
                            }
                        }

                    }
                }
                console.dir(data[i]);
                response.push(bot.call(data[i]));
            }
            contexts = data;

            console.dir(response);
            res.end(JSON.stringify(response));
        } else {
            res.end('[]');
        }
    });

}).listen(3000);

var contexts = [];