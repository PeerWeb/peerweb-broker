http = require('http');
var _ = require('underscore-node');
var PeerServer = require('peer').PeerServer;
var peerServer = new PeerServer({port: 9000, key: 'pwnet', path: '/broker'});
var connected = [];
peerServer.on('connection', function (id) {
  console.log(id + ' connected');
  connected.push(id);
});
peerServer.on('disconnect', function (id) {
  index = connected.indexOf(id);
  if (index > -1) {
    connected.splice(index, 1);
  }
  console.log(id + ' disconnected');
});


paths = {
    '/' : function(req,res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.writeHead(200, {'Content-Type': 'application/json'});
	var livePeers = _.shuffle(connected);
        res.end(JSON.stringify(livePeers));
    },
}

apiServer = http.createServer( function(req, res) {
    req.content = '';
    if (!(req.url in paths))
        req.url = '/'
    paths[req.url].apply(this, [req,res]);
});

port = 3000;
host = '0.0.0.0';
apiServer.listen(port, host);
