"use strict"
// cordova plugin add cordova-plugin-dialogs, cordova-plugin-geolocation

const URL = "https://maps.googleapis.com/maps/api"
/*
$(document).ready(async function () {
	// Soluzione 1
	let promise = caricaGoogleMaps();
	promise.then(documentReady);
	promise.catch(function (err) {
		alert('Errore caricamento google maps')
	});

	// Soluzione 2
	// await aspetta la promise. quando restituisce il then va avanti.
	// la procedura deve essere dichiarata async
	await caricaGoogleMaps();
	documentReady()
})
*/

window.onload = async function () {
	await caricaGoogleMaps();
	documentReady()
}

function documentReady() {
	document.addEventListener('deviceready', function () {

		let mapContainser = $("#mapContainer")[0]  // js
		let results = $("#results")

		$("#btnAvvia").on("click", startWatch)
		$("#btnArresta").on("click", stopWatch);

		let gpsOptions = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		}

		let watchID = null;
		function startWatch() {
			results.html("");
			if (!watchID) {
				watchID = navigator.geolocation.watchPosition(visualizzaPosizione, error, gpsOptions)
				notifica("Lettura Avviata");
			}
		}

		function stopWatch() {
			if (watchID) {
				navigator.geolocation.clearWatch(watchID);
				watchID = null;
				map = null;
				notifica("Lettura Arrestata");
			}
		}

		/* ************************************************ */
		let map = null;
		let marker = null;
		function visualizzaPosizione(position) {
			results.html(`${position.coords.latitude.toFixed(5)}, 
						  ${position.coords.longitude.toFixed(5)}  
						  &plusmn;${position.coords.accuracy.toFixed(0)}m 
						  - altitudine:${position.coords.altitude}m`)
			let currentPos = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude)
			if (!map) {
				let mapOptions = {
					center: currentPos,
					zoom: 16,
				};
				map = new google.maps.Map(mapContainer, mapOptions);
				marker = new google.maps.Marker({
					map: map,
					position: currentPos,
					title: "Questa è la tua posizione!",
					animation: google.maps.Animation.BOUNCE,
				});
			}

			else {
				marker.setPosition(currentPos);
				// non consente di 'spostare' la mappa. Fastidioso
				// map.setCenter(currentPos)		
			}
		}

		function error(err) {
			// Gli errori di timeout sono abbastanza frequenti
			console.log("Errore: " + err.code + " - " + err.message);
		}

	})
}



function notifica(msg) {
	navigator.notification.alert(
		msg,
		function () { },
		"GPS",       // Titolo finestra
		"Ok"          // pulsante di chiusura
	);
}

function caricaGoogleMaps() {
	let promise = new Promise(function (resolve, reject) {
		let script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = URL + '/js?v=3&key=' + MAP_KEY;
		document.body.appendChild(script);
		script.onload = resolve;
		script.onerror = reject;
	})
	return promise;
}
