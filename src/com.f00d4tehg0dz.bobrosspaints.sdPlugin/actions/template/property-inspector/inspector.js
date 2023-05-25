/// <reference path="../../../libs/js/property-inspector.js" />
/// <reference path="../../../libs/js/utils.js" />

// Triggered when the plugin is connected to the Stream Deck
$PI.onConnected((jsn) => {
    const { actionInfo, appInfo, connection, messageType, port, uuid } = jsn;
    const { payload, context } = actionInfo;
    const { settings } = payload;

   // Load the previously selected episode on connect
   if (settings && settings.imgLink && settings.youTube) {

        const imageElement = document.getElementById('currentEpisodeImage');
        const videoElement = document.getElementById('currentEpisodeVideoLink');

        if (imageElement) {
            imageElement.src = settings.imgLink;
        }

        if (videoElement) {
            videoElement.innerText = settings.youTube;
        }
    }
});

// Triggered when the plugin receives global settings from the Stream Deck
$PI.onDidReceiveGlobalSettings(({ payload }) => {
    const settings = payload.settings;
    if (settings) {
        displayEpisode(settings);
    }
});

// Display the episode information in the UI
function displayEpisode(settings) {
    let videoElement = document.getElementById("currentEpisodeVideoLink");
    // let imageElement = document.getElementById("currentEpisodeImage");
    // if (imageElement) {
    //     imageElement.src = settings.imgLink;
    // }
    if (videoElement) {
        videoElement.innerText = settings.youTube;
    }
}

/**
 * Opens a URL in the default web browser
 * @param {string} url - The URL to open
 */
function openUrl(url) {
	if (!url) {
		console.error('A URL is required for openUrl.');
	}

	// Create an <a> element with the specified URL
	const link = document.createElement('a');
	link.href = url;
	link.target = '_blank';

	// Simulate a click on the <a> element to open the URL in a new browser window
	link.click();
}


// Event listener for the YouTube video button
document.querySelector('#youtube-video').addEventListener('click', () => {
	let videoElement = document.getElementById("currentEpisodeVideoLink");
	if (videoElement) {
		let youtubeLink = videoElement.innerText;
		if (youtubeLink) {
			openUrl(youtubeLink);
		}
	}
});

// Event listener for the Github button
document.querySelector('#github').addEventListener('click', () => {
	openUrl('https://github.com/f00d4tehg0dz/elgato-streamdeck-bob-ross-paints');
});

/**
 * Provide window level functions to use in the external window
 * (this can be removed if the external window is not used)
 */
window.sendToInspector = (data) => {
    console.log(data);
};

// Activate and handle tabs
function activateTabs(activeTab) {
    const allTabs = Array.from(document.querySelectorAll('.tab'));
    let activeTabEl = null;
    allTabs.forEach((el, i) => {
        el.onclick = () => clickTab(el);
        if (el.dataset?.target === activeTab) {
            activeTabEl = el;
        }
    });
    if (activeTabEl) {
        clickTab(activeTabEl);
    } else if (allTabs.length) {
        clickTab(allTabs[0]);
    }
}

// Handle the click event of a tab
function clickTab(clickedTab) {
    const allTabs = Array.from(document.querySelectorAll('.tab'));
    allTabs.forEach((el, i) => el.classList.remove('selected'));
    clickedTab.classList.add('selected');
    activeTab = clickedTab.dataset?.target;
    allTabs.forEach((el, i) => {
        if (el.dataset.target) {
            const t = document.querySelector(el.dataset.target);
            if (t) {
                t.style.display = el == clickedTab ? 'block' : 'none';
            }
        }
    });
}

// Activate the tabs
activateTabs();
