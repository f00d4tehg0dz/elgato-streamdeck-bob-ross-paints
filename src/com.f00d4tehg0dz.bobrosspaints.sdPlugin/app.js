/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

// Create a new Action instance with the provided action identifier
const myAction = new Action('com.f00d4tehg0dz.bobrosspaints.action');

/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	console.log('Stream Deck connected!');
});

/**
 * Load an image from the current episode
 * @param {string} currentEpisodeImg - The image URL of the current episode
 * @returns {Promise<string|null>} - The base64 representation of the image or null if the image is undefined
 */
function loadImageFromEpisode(currentEpisodeImg) {
	return new Promise((resolve) => {
		if (!currentEpisodeImg) {
			resolve(null); // or any other appropriate handling for undefined imgLink
		}

		let image = new Image();
		image.src = currentEpisodeImg;
		image.onload = function () {
			let canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;

			let ctx = canvas.getContext('2d');
			ctx.drawImage(this, 0, 0, this.width, this.height);

			canvas.toBlob(function (blob) {
				let reader = new FileReader();
				reader.onloadend = function () {
					resolve(reader.result);
				}
				reader.readAsDataURL(blob);
			});
		};
	});
}

// Fetch your data outside of the key up event handler
let episodes = [];
fetch('./bobRoss.json')
	.then(response => response.json())
	.then(data => {
		episodes = data;
	})
	.catch(error => console.error("Failed to retrieve JSON data:", error));

// Then modify your onKeyUp handler
myAction.onKeyUp(({ action, context, device, event, payload }) => {
	// Get a random episode each time the button is pressed
	let currentEpisode = episodes[Math.floor(Math.random() * episodes.length)];

	// Update the settings with the new imgLink, title, videoLink
	$SD.setGlobalSettings({ imgLink: currentEpisode.imgLink, title: currentEpisode.title, youTube: currentEpisode.videoLink });

	// Load the image from the current episode and update the button image
	loadImageFromEpisode(currentEpisode.imgLink).then(base64Image => {
		$SD.setImage(context, base64Image);
	}).catch(err => {
		console.error("Failed to load image:", err);
	});
});

// Event handler for dial rotation event
myAction.onDialRotate(({ action, context, device, event, payload }) => {
	console.log('Your dial code goes here!');
});
