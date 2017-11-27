//Mitch Dorrestijn's Web-RTC test (voor tekst en video chat).
const getUserMedia = require('getusermedia');
let constraints = { audio: true, video: { width: 1280, height: 720 }};

navigator.mediaDevices.getUserMedia(constraints)
	.then((stream) => {

		//Peer inladen (npm-install)
		const Peer = require('simple-peer');

		//Peer aanmaken
		const peer = new Peer({
			initiator: location.hash === '#init', //Geeft aan wie de eerste peer is
			trickle: false,
			stream: stream
		});

		//Als de peer een signaal ontvangt
		peer.on('signal', (data) => {
			document.getElementById('mijnID').value = JSON.stringify(data);
		});

		//Laat de eerste peer weten dat er nog een peer is die wil praten
		document.getElementById('connect').addEventListener('click', () => {
			let anderID = JSON.parse(document.getElementById('anderID').value);
			peer.signal(anderID);
		});

		//Verstuur een bericht
		document.getElementById('verstuur').addEventListener('click', () => {
			let jeBericht = document.getElementById('jeBericht').value;
			peer.send(jeBericht);
		});

		//Laat het versturde bericht zien
		peer.on('data', (data) => {
			document.getElementById('berichten').textContent += data + '\n';
		});

		//Videomogelijkheid
		peer.on('stream', (stream) => {
			let video = document.createElement('video');
			document.body.appendChild(video);
			video.src = window.URL.createObjectURL(stream);
			video.play();
		});
})
.catch((err) => {
	console.log('Videochat niet geaccepteerd.');
});
