//Mitch Dorrestijn's Web-RTC test (voor tekst chat)

//Peer inladen (npm-install)
var Peer = require('simple-peer');

//Peer aanmaken
var peer = new Peer({
	initiator: location.hash === '#init', //Geeft aan wie de eerste peer is
	trickle: false
});

//Als de peer een signaal ontvangt
peer.on('signal', function(data){
	document.getElementById('mijnID').value = JSON.stringify(data);
});

//Laat de eerste peer weten dat er nog een peer is die wil praten
document.getElementById('connect').addEventListener('click', function() {
	var anderID = JSON.parse(document.getElementById('anderID').value);
	peer.signal(anderID);
});

//Verstuur een bericht
document.getElementById('verstuur').addEventListener('click', function() {
	var jeBericht = document.getElementById('jeBericht').value;
	peer.send(jeBericht);
});

//Laat het versturde bericht zien
peer.on('data', function(data){
	document.getElementById('berichten').textContent += data + '\n';
});
