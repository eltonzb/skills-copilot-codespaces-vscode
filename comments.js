// Create web server
var express = require('express');
var app = express();
// Create server
var server = require('http').createServer(app);
// Create socket
var io = require('socket.io').listen(server);
// Create mongoose
var mongoose = require('mongoose');
// Create users array
users = [];
// Create connections array
connections = [];
// Create port
var port = process.env.PORT || 3000;
// Connect to mongoDB
mongoose.connect('mongodb://localhost/chat', function(err){
	if(err){
		console.log(err);
	} else {
		console.log('Connected to mongodb!');
	}
});
// Create user schema
var Schema = mongoose.Schema;
var chatSchema = new Schema({
	nickname: String,
	msg: String,
	created: {type: Date, default: Date.now}
});
// Create model
var Chat = mongoose.model('Message', chatSchema);
// Create server
server.listen(port);
console.log('Server running...');
// Create route
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
// Create connection
io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
	// Disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});
	// Send message
	socket.on('send message', function(data){
		var newMsg = new Chat({msg: data, nickname: socket.nickname});
		newMsg.save(function(err){
			if(err) throw err;
			io.sockets.emit('new message', {msg: data, nickname: socket.nickname});
		});
	});
	// New user
	socket.on('new user', function(data, callback){
		callback(true);
		socket.nickname = data;
		users.push(socket.nickname);
		updateUsernames();
	});
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});