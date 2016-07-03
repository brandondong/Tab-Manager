function createTabPopup() {
	// TODO should determine if tabs outside the window will be queried from preferences
	chrome.tabs.query({}, function(tabs) {
		createPopup(tabs);
	});
}

function createQuickAccessPopup() {
	// TODO implement popup
	alert("quick access!");
}

function createPopup(tabs) {
	// TODO implement popup
	alert("tabs! open tabs: " + tabs.length);
}