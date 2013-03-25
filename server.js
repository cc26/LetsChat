/*
Chatroom
Author: Cheng Lun Chen 

*/

var express = require('express');
var app = express();

app.use(express.bodyParser());

// Connect to Database
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://chatroom.db');


// Use Hogan
var engines = require('consolidate');
app.engine('html',engines.hogan);
app.set('views',__dirname + '/templates');


app.use('/public', express.static(__dirname + '/public'));

// I should create table at first
conn.query('CREATE TABLE messages(id INTEGER PRIMARY KEY AUTOINCREMENT, room TEXT, nickname TEXT,body TEXT, time INTEGER);').on('end', function(){
		console.log('Made table!');
});

var usernumber = 0;

app.get('/:roomName/usernumber', function(request, response){
	usernumber = usernumber+1;
	username = " user # "+usernumber;
	response.send(username);
	console.log("response sent");
});
// get a list of rooms on the server
// probably don't need this right now

app.get('/:roomName/messages.json', function(request, response){
	console.log("roomName/messages.json");
	var sql = 'SELECT * FROM messages WHERE room=$1 ORDER BY time ASC';
	var q = conn.query(sql,request.params.roomName);
	// console.log(q);
	messages = [];

	q.on('row',function(row){

		messages.push({nickname:row.nickname,body:row.body,time:row.time, id:row.id});

	});
	q.on('end',function(){
		response.json(messages);
	});

});



// I believe that I need to put the messages into the database
app.post('/:roomName/messages',function(request,response){
	
	console.log("/:roomName/messages");

	var roomname = request.params.roomName;
	var nickname = request.body.nickname;
	var message = request.body.message;
	var time = request.body.time;
	// Should send message to database:
	conn.query('INSERT INTO messages(room,nickname,body,time) VALUES ($1, $2, $3, $4)', 
		[roomname, nickname, message, time]);
	
	// Redirect 
	response.redirect('/'+request.params.roomName);
	response.end();


});


app.get('/newRoom.json',function(request,response){
	console.log("/newRoom.json");
	var q = conn.query('SELECT DISTINCT room FROM messages');
	rooms = [];

	q.on('row',function(row){

		rooms.push({room:row.room});
		console.log("rooms");

	});
	q.on('end',function(){
		response.json(rooms);
	});

});


app.get('/newRoom',function(request,response){

	var roomName = generateRoomIdentifer();
	conn.query('INSERT INTO messages(room) VALUES ($1)', 
	[roomName]);
	response.redirect('/'+roomName);
});

// Not quite sure what should I do right now.
app.get('/:roomName',function(request,response){
	console.log("/:roomName");
	var name = request.params.roomName;

	// I think I should split out an html page right here
	response.render('room.html',{roomName:request.params.roomName});
});

// I should have a button for creating room 
// get a list of rooms on the server




app.get('/',function(request, response){

	response.render('index.html');

});




function generateRoomIdentifer(){

	var chars = 'abcdefghijklmnopqrstuvwxyz123456789';
	var result = '';
	for(var i=0; i<6; i++){
		result += chars.charAt(Math.floor(Math.random()*chars.length));
	}
	return result;
}


app.listen(8080);