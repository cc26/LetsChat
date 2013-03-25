/* This is a client side javascript file */

// This code will be executed when the page finishes loading
window.addEventListener('load', function(){

	var nickname = prompt("What's your nickname?");
	if(nickname == "" || nickname == null){
		var req = new XMLHttpRequest();
		var roomName = meta('roomName');

		req.open('GET','http://localhost:8080/'+roomName+'/usernumber',false);
		// var chars = '123456789';
		// var result = '';
		// for(var i=0; i<5; i++){
		// 	result += chars.charAt(Math.floor(Math.random()*chars.length));
		// }
		// nickname = "#"+result;
		req.send(null);
	

		console.log("name:"+req.responseText);
		nickname = req.responseText;
	}

	alert("Welcome your name is: "+nickname);
	// I should be able to make a hashtable in client side but should I do that?


	var messageFrom = document.getElementById('messageFrom');
	messageForm.addEventListener('submit',sendMessage,false);
	
	var maxid=0;
	var maxtime =0;

	function meta(name) {
	    var tag = document.querySelector('meta[name=' + name + ']');
	    if (tag != null)
	        return tag.content;
	    return '';
	}

	// var roomName = meta('roomName');
	// var requestTest = new XMLHttpRequest();
	// var roomName1 = meta('roomName');

	// requestTest.open('GET','http://localhost:8080/'+roomName1+'/hello.txt',true);
	// requestTest.send(null);
	function display(chats){
		// console.log("I do nothing");		
		var data = JSON.parse(chats);

		var chats_container = document.getElementById('chats_container');
		var user = document.getElementById('user');
		user.innerHTML = 'User:    ' + nickname;
		


		for(var i =0; i < data.length; i++){
			
			if(data[i].id > maxid && data[i].nickname!=null){
			 	if(data[i].nickname != nickname || (data[i].nickname == nickname) && (maxtime < data[i].time)){
					maxid = data[i].id;
					var tofill = document.createElement('div');
					var message_div;
					var name_div;
					
					tofill.className = "single_chat";
					name_div = '<div class="name">'+data[i].nickname+':'+'</div>';
					message_div= '<div class="message">'+data[i].body+'</div>';
					tofill.innerHTML =name_div+message_div;
			
					chats_container.appendChild(tofill);	
				}
			}	
		}	


	}
	// This is the part for get request
	function request(url,display){
		var req = new XMLHttpRequest();
		var roomName = meta('roomName');
		req.open('GET','http://localhost:8080/'+roomName+'/messages.json',true);
		req.addEventListener('load', function(){
			if (req.status == 200)
			{
				// call the callback function
				display(req.responseText);
			}
		}, false);
		req.send(null);
	}






	var wrapper = function(){
		request('/'+meta('roomName')+'/messages.json',display);
	}
	// Not quite sure if I am doing it right needs to check
	wrapper();
	setInterval(wrapper,3000);


	// This is the part for post request
	

	function sendMessage(e){

		e.preventDefault();
		// var fd = new FormData(document.getElementById('messageForm'));
		var fd = new FormData();
		var d = new Date();
		var n = d.getTime();
		
		var message = document.getElementById('messageField').value
		document.getElementById('messageField').value="";

		fd.append('nickname',nickname);

		fd.append('message',message);
		fd.append('time',n);
		
		var req = new XMLHttpRequest();
		var roomName = meta('roomName');
	
		req.open('POST','/'+roomName+'/messages',true);
		req.send(fd);

		// Add eventlistener when we have a post request 
		req.addEventListener('load',function(){

			// Reset the maxtime when the user post
			maxtime = n;
			// create the div of the message including name and message
			var tofill = document.createElement('div');
			var message_div;
			var name_div;
			var chats_container = document.getElementById('chats_container');

			tofill.className = "single_chat";
			name_div = '<div class="my_name">'+nickname+':'+'</div>';
			message_div= '<div class="my_message">'+message+'</div>';
			tofill.innerHTML =name_div+message_div;
			chats_container.appendChild(tofill);
			chats_container.scrollTop = chats_container.scrollHeight;

		});
	}

}, false);

